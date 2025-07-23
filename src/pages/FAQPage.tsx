import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>What are your delivery times?</AccordionTrigger>
          <AccordionContent>
            Standard UK delivery takes 2-3 business days, while express delivery takes 1-2 business days. International orders typically take 5-14 business days depending on the destination.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Do you offer free shipping?</AccordionTrigger>
          <AccordionContent>
            Yes! We offer free standard shipping on all UK orders over £50.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit and debit cards through our secure payment processor.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>Can I track my order?</AccordionTrigger>
          <AccordionContent>
            Yes, once your order has been dispatched, you'll receive a tracking number via email to monitor your delivery.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger>Are your products suitable for vegans?</AccordionTrigger>
          <AccordionContent>
            Many of our products are vegan-friendly. Please check the product descriptions for specific dietary information.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQPage;