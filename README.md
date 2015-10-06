# IoT Data Provider

The goal of this application is to simplify data exchange between third-party APIs and IoT devices (Arduino Yun, spark, ESP8266 etc.).   

## How does it work ?
The concept is simple : each IoT device is linked to a **client** in the application. A client is composed of an **API key** used to authenticate the requests of the device, and of a list of methods that will be used to retrieve the data that composes its payload. 

The device makes its request to the app, providing its API key, and the app returns the payload as a string (format csv: each value is separated by a coma). 

When a client is created, you will have to choose specific methods that will be called in order to retrieve the data that composes the payload. You start by selecting the API to be used, then the method and finally providing additional parameters if necessary.  

## Request url:
The following url is used to pass a request : 
> /clients/payload?key=client_api_key


## How to add new APIs to the App:
New APIs are registered in the **apis** directory. 3 steps are required : 
1. Add the functions required to communicate with the API but that wont be exposed publicly to the **parent** subdirectory. 
2. Add the functions that will be publicly available in the **interfaces** folder. 
3. Add the new interface to the **index.js** file at the root of the **apis** directory. 

So why the two first steps ? Let's take a practical example : I want to look for something in a twitter user's timeline. I want the search to cover what he tweeted as well as what was tweeted to him. In that case, we'll register two methods in the **parent** class: one that will use twitter's API in order to search his tweets and another that will look into what was tweeted to him. Then I'll add a method in the **interface** that will perform both theses actions concurrently. 