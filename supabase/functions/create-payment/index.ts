import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, items, shippingAddress, user_id, guest_email, discount_percentage = 0 } = await req.json();

    // Get user if authenticated
    let user = null;
    let user_email = guest_email;
    
    if (user_id) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const supabaseAuth = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? ""
        );
        const { data } = await supabaseAuth.auth.getUser(token);
        user = data.user;
        user_email = user?.email || guest_email;
      }
    }

    // Initialize Stripe and Supabase service client
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user_email || guest_email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create line items with discount applied
    const lineItems = items.map((item: any) => {
      const unitPrice = Math.round(item.price * 100); // Convert to pence
      const discountedPrice = discount_percentage > 0 
        ? Math.round(unitPrice * (1 - discount_percentage))
        : unitPrice;
      
      return {
        price_data: {
          currency: "gbp",
          product_data: { name: item.name },
          unit_amount: discountedPrice,
        },
        quantity: item.quantity,
      };
    });

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : (guest_email || user_email),
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
    });

    // Create order record
    const { data: orderData, error: orderError } = await supabaseService
      .from("orders")
      .insert({
        user_id: user_id,
        guest_email: guest_email,
        total_amount: amount,
        status: "Pending",
        shipping_address: shippingAddress,
        points_earned: Math.floor(amount / 100), // 1 point per pound
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Create order items and update stock
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.name, // Using name as product_id for now
      quantity: item.quantity,
      price: Math.round(item.price * 100),
    }));

    const { error: itemsError } = await supabaseService
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
    }

    // Update stock quantities
    for (const item of items) {
      const { error: stockError } = await supabaseService
        .rpc('decrement_stock', {
          product_name: item.name,
          quantity: item.quantity
        });

      if (stockError) {
        console.error("Stock update error:", stockError);
      }
    }

    // Update user loyalty points if authenticated
    if (user_id && user) {
      const pointsToAdd = Math.floor(amount / 100);
      const { error: pointsError } = await supabaseService
        .rpc('increment_loyalty_points', {
          user_id_param: user_id,
          points_to_add: pointsToAdd
        });

      if (pointsError) {
        console.error("Points update error:", pointsError);
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});