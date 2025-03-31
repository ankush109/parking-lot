# Parking Lot System 

Build the image 

```sh
docker build -t nestjs-app .           

```
Run the container with the image

```sh
docker run -it -p 5000:5000  nestjs-app      

```

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
