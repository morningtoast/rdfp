#Responsive DFP Delivery (RDFP)
The purpose of this class is to allow for delivery of different DFP ads based on screen size. No framework required.

RDFP treats responsive handling per-device, not browser squeezing. This means that ads will not change as you change browser size on your desktop. This is intended to help with responsive design per-device which have fixed-width sizes. For example, RDFP will serve a small ad on a phone but a big ad on the desktop using the same markup.

RDFP requires data from your DFP account, such as your Network ID number and ad names.

##Dependencies
RDFP does not have any other framework dependencies but will work with the likes of jQuery, Prototype, etc.

##How to use RDFP
RDFP uses data attributes on HTML elements combined with custom slot definitions to determine which ad to deliver.

###Markup
Place an element where you want your ad to display and give it a class name. Then give it a data attribute called `ads` that has a value of a comma-separate list of ad slots that qualify for that space.

    <div class="placeadhere" data-ads="square,leader"></div>
  
In this example, we want to load either the ad "square" or "leader", whichever one qualifies based on screen size.


###Defining ads
You need to tell RDFP which ad slots you're going to be using and provide with data like screen size and data from Google DFP. Use the `Rdfp.register()` function.

Syntax: `Rdfp.register(str slotName, int maxScreenWidth, str googleAdId, array adSize);`

    Rdfp.register("square", 0, "RDFP_Demo_300", [300,250]);
    Rdfp.register("leader", 600, "RLD_Demo_728", [728,90]);
  
In this example, we're defining two slots: "square" and "leader".
- The "square" ad should be used when the screen size is greater than zero
- The "leader" ad should be used when the screen size is greater than 600

RDFP checks all the ad slots on an element and only use the one that meets the screen size rules. So in the above example, if the browser window was 600 pixels or wider, ONLY the "leader" ad would be called and delivered, otherwise the "square" ad would be served. *The last definition that meets the size requirement will win.*

The third and fourth arguments will come from your Google DFP tag generation. Just copy and paste that information into your RDFP `regigster()` calls.

You can make your `register()` calls anywhere on your page.


### Ad delivery
After your ad slots are defined you can deliver the ads. Use the `deliver()` function.

Syntax: `Rdfp.deliver(int dfpNetworkId, str className)`

    Rdfp.deliver(1067507, "placeadhere");
  
The first argument is your Google DFP Network Code number. You'll see this number when you generate tags in DFP or when you click "Admin" from the DFP dashboard.

The second argument is the name of the class you're using on the ad container elements. Note that this is the name without any sort of selector prefix.

You should only call `deliver()` in your site footer JS after all markup and ad definitions have been rendered.




