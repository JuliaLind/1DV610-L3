# 1DV610-L3 Currency convert + Norway bank api adapter restAPI

## About

This is a school project that is deployed at https://julia-lnu.duckdns.org/exr/ .  

A single page application, with a GUI for converting an amount from base currency to target currencies, is available at root https://julia-lnu.duckdns.org/exr/.  

![GUI usage example 1](.readme/gui_usage_example_1.png)  

The API https://julia-lnu.duckdns.org/exr/api/v1/ provides various endpoints that return average currencies based on passed parameters. The endpoints with usage examples are desribed with Swagger at https://julia-lnu.duckdns.org/exr/api/swagger.  


## Testing

The API endpoints, and the service-classes used by webapp have been e2e tested with a coverage of above 90% measured with c8. Latest test report available under https://github.com/JuliaLind/1DV610-L3/actions/workflows/ci.yml .  

![test pt1](.readme/test_results_pt1.png)  
![test pt2](.readme/test_results_pt2.png)  

The app is deployed via Guthub actions - both Lint and Test steps are required to pass in order fot he Deploy step to execute.   

The webapp gui is tested manually (ref screenshot above). 
