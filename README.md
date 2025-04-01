# Parking Lot System 

LIVE URL : https://parking-lot-3ayw.onrender.com/api ( can be slow as deployed on a free service in Render )


## Running the Application ( Using Docker )

Build the image 

```sh
docker build -t nestjs-app .           

```
Run the container with the image

```sh
docker run -it -p 5000:5000  nestjs-app      

```

## How to run the app locally : ( Without Docker )


```sh
npm i 

```

```sh
npm run start

```

How to run the tests 

```sh
npm test

```

Download the postman collection to test out the application -> https://drive.google.com/file/d/1v99PrL4Czz7io4brd8lQh2hu106CJynp/view?usp=sharing



``` 
 1. Initialize the parking Slot :

  GET :   http://localhost:5000/api/parking-lot
  Request Body : {        
     "number_of_slots":10
  }


 2. Park a Car 

 POST :   http://localhost:5000/api/parking-lot/park
  Request Body : {        
      "car_reg_no" :"WB012024",
      "car_color":"red"
  }

 3. Get registration numbers of all the vehicle having a color 

 GET : http://localhost:5000/api/parking-lot/registration_numbers/:color   ( eg:color = red/green/yellow ) 


4. Get the Slot numbers of all the vehicle having a color 

GET : http://localhost:5000/api/parking-lot/slot_numbers/:color    ( eg:color = red/green/yellow ) 
 
5. Clear a slot using slot number or registration number 

POST : http://localhost:5000/api/parking-lot/clear  

Request Body : {        
   "slot_number" : 1 
  }
OR 
Request Body : {        
   "car_registration_no" : "WB012003"
  }

6. Get all the slots which are currently occupied :

GET : http://localhost:5000/api/parking-lot/status

7. Increase the Slot number :

PATCH : http://localhost:5000/api/parking-lot
Request Body : {
    "increment_slot":5
}

8. Duration of a car by registration number : 

GET : http://localhost:5000/api/parking-lot/duration/WB012024

                 

```
My implementation : 

 1. Used Min heap as its the most optimized way to get the nearest available parking slot
 2. Used map to store the parking slot to its parked car details < 1: { reg_no :"XXX" , car_color:"red" } > [ better than array as its 0(1) lookup ]
 3. Used functional and object oriented way keeping in mind reusablity of function , using helper functions to reuse function in the overall code base )   
 4. Have written unit test in service leven and controller level (e2e test cases) to test the functionality works as expected .
 5. Added a duration feature to check the duration of a car parked in a particular slot 
 6. Dockerized the app 
 7. Deployed the application in render 
 8. Have done some validation checks at each service level for eg : if the reg_no exits or not , if parking slot has already been initialized ....
 9. Have used custom logger to log and write those in a excel file ( extending base console Logger class ) for adding our custom functionality 
 10. Used a global execptions filter to catch and normalize the errors adding any extra property if needed 
 



So, Why I used heap I could have used a sorted array which would give the same results right the nearest available slot but in that case I would have to sort it every time i insert or remove the available slots haivng a time complexity of n(logn) where as in heap its logn for insertion and deletion so its much more effecient than using a array.


