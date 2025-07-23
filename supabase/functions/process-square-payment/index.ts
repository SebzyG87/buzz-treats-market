import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { sourceId, amount, items, shippingAddress, user_id, guest_email, discount_percentage = 0, promo_code } = await req.json();

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

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Process Square payment - always use sandbox for this setup
    const squareResponse = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get("SQUARE_ACCESS_TOKEN")}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify({
        source_id: sourceId,
        amount_money: {
          amount: amount,
          currency: 'GBP'
        },
        location_id: Deno.env.get("SQUARE_LOCATION_ID"),
        idempotency_key: crypto.randomUUID()
      })
    });

    const squareResult = await squareResponse.json();

    if (!squareResponse.ok || squareResult.errors) {
      console.error("Square payment error:", squareResult);
      throw new Error(squareResult.errors?.[0]?.detail || "Payment failed");
    }

    // Mark coupon as used if applied
    if (promo_code && user_id) {
      await supabaseService
        .from('coupon_codes')
        .update({ 
          used: true, 
          used_at: new Date().toISOString(),
          user_id: user_id 
        })
        .eq('code', promo_code)
        .eq('used', false);
    }

    // Create order record
    const { data: orderData, error: orderError } = await supabaseService
      .from("orders")
      .insert({
        user_id: user_id,
        guest_email: guest_email,
        total_amount: amount,
        status: "Paid",
        shipping_address: shippingAddress,
        points_earned: Math.floor(amount / 100), // 1 point per pound
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.name,
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

    return new Response(JSON.stringify({ 
      success: true, 
      payment_id: squareResult.payment?.id,
      order_id: orderData.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in process-square-payment:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});