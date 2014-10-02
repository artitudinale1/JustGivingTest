var app = angular.module("myapp", ["firebase"]); // declaring my app

app.controller("MyController", function($scope, $firebase) {
    // now we can use $firebase to synchronize data between clients and the server!
    var ref = new Firebase("https://jgivetest.firebaseio.com/");
    var sync = $firebase(ref);
    var syncObject = sync.$asObject();
    $scope.data = syncObject; // get all firebase data in a obj aka all the donation
   // $scope.DonationsNum = Object.keys($scope.data).length //find size of my obj -- yep! dowsn't work in IE8
       $scope.DonationsNum = 0;
          for(var prop in $scope.data ){
              if($scope.data.hasOwnProperty(prop))
         $scope.DonationsNum++;
     }

    $scope.master = {}; // set object where to push data
    $scope.submitted = false; //set variable to control if form has been submitted or not



        
    //function called when form submit  

    $scope.clearForm = function () {
       $scope.donationForm.$setPristine(); //reset form using angularjs
       $scope.user.name = " ";

    }  

    $scope.submitForm = function(user) {
                // check to make sure the form is completely valid
                 $scope.submitted = true;
                 var regex = /(£\d+(?:\.\d+)?)/g; //form need to contain £ sign and numbers
                  if ( undefined != user &&  user.name.match(regex)) {
                    $scope.donationForm.$invalid =  false; // put together my verification and Angularjs one
                    
                    $scope.master = angular.copy(user); // we copy user obj in angularjs
                    ref.push({donations: $scope.master}); //let s push it in Firebase
                    
                     $scope.clearForm();
                     
                  }               
                else {
                    $scope.donationForm.$invalid = true; // put together my verification and Angularjs one
                    
                    $scope.clearForm();
                     
                }

            };

      ref.on('value', function (snapshot) {  // get how many donatations we have in db
      	DonationsAll = snapshot.val()
       // $scope.DonationsNum = Object.keys(DonationsAll).length  IE8 !!
       $scope.DonationsNum = 0;
          for(var prop in DonationsAll ){
              if(DonationsAll.hasOwnProperty(prop))
         $scope.DonationsNum++;
     }
     
      }, function (errorObject) {  // errpr if we don't get any objs
     //console.log('The read failed: ' + errorObject.code);
      });
});

$('#close').click(function() { $("#dialog").dialog("close"); }); 

$(function() { //jQuery function for popup
          $( "#dialog" ).dialog({
          	width: 292,
            dialogClass: 'no-close noTitleStuff', // no close button, no title
            
    	 });
  });


