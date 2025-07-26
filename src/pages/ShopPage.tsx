import React from 'react';

const ShopPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Category Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div id="my-categories-121542775"></div>
            <div>
              <script 
                data-cfasync="false" 
                type="text/javascript" 
                src="https://app.ecwid.com/script.js?121542775&data_platform=code&data_date=2025-07-25" 
                charSet="utf-8"
              ></script>
              <script type="text/javascript">
                {`xCategoriesV2("id=my-categories-121542775");`}
              </script>
            </div>
          </div>
        </div>

        {/* Right Column - Product Grid */}
        <div className="lg:col-span-3">
          <div id="my-store-121542775"></div>
          <div>
            <script 
              data-cfasync="false" 
              type="text/javascript" 
              src="https://app.ecwid.com/script.js?121542775&data_platform=code&data_date=2025-07-25" 
              charSet="utf-8"
            ></script>
            <script type="text/javascript">
              {`xProductBrowser("id=my-store-121542775");`}
            </script>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;