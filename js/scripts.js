// ************************ front end logic ************************ 
var pizza;

$(document).ready(function(){
  // set default pizza
  pizza = new Pizza;
  pizza.size = $("input:radio[name=size]:checked").val();
  $("input:checkbox[name=toppings]:checked").each(function(){
    pizza.toppings.push($(this).val());
  });
  displayOutput(pizza);

  // when name is changed
  $("input#name").change(function() {
    pizza.orderName = $("input#name").val().toUpperCase();
    calcPizzaPrice(pizza);
    displayOutput(pizza);
  });

  // when size is changed
  $("input:radio[name=size]").change(function() {
    pizza.size = $("input:radio[name=size]:checked").val();
    calcPizzaPrice(pizza);
    displayOutput(pizza);
  });
  
  // when toppings are changed
  $("input:checkbox[name=toppings]").change(function() {
    // ??? is it very inefficient to reevaluate the entire toppings every time?
    // ??? otherwise I have to track each change or check if that topping exists in the array and also vice versa (if toppings are removed)
    pizza.toppings = [];
    $("input:checkbox[name=toppings]:checked").each(function(){
      pizza.toppings.push($(this).val());
    });
    calcPizzaPrice(pizza);
    displayOutput(pizza);
  });


  // when Make My Pizza button is clicked
  $("form#form-order").submit(function(event){
    event.preventDefault();
    if (blnValidOrder(pizza)) {
      alert ("You've got great taste! We're on it and your pizza will be ready in just a few minutes!");
      $("span#output-title").text("Making " + pizza.orderName + "'s yumm-azing pizza!");
      $("div#div-output").css("background-color", "lightgoldenrodyellow");
      $("#btn-make-pizza").attr("disabled", true);
    };
  });
  
  
});

// updates output 
var displayOutput = function(pizza){
  var strTitle = "";
  if (pizza.orderName) {
    strTitle = pizza.orderName + "'s custom pizza...";
  } else {
    strTitle = "Your custom pizza...";
  }
  $("span#output-title").text(strTitle);

  // topping value has the Category Letter : Topping name (like B:Onions) so need to slice
  var toppingHTML = "";
  pizza.toppings.forEach(function(topping){
    toppingHTML += "<li>" + topping.slice(2) + "</li>";
  });
  $("span#output-toppings").html(toppingHTML);
  
  $("span#output-size").text(pizza.size);
  $("span#output-price").text(pizza.price.toFixed(2));
};


// ************************ biz logic ************************ 
function Pizza(){
  this.orderName = "";
  this.size = "";
  this.toppings = [];
  this.price = 0.00;
};


// when Make My Pizza button is clicked, verify all required inputs
var blnValidOrder = function(pizza) {
  if (pizza.orderName.length === 0) {
    alert("Please specify a name for this amazing pizza.");
    return false;
  };

  if (pizza.toppings.length === 0) {
    var reply = confirm("You haven't select any toppings at all. Are you sure you want a plain crust?");
    if ( reply === false) {
      return false;
    }
  };

  return true;
};

// calculate pizza price function
var calcPizzaPrice = function(pizza) {
  var num = 0;
  // size based
  switch (pizza.size) {
    case "Small":
      num = 8;
      break;
    case "Medium":
      num = 10;
      break;
    case "Large":
      num = 13;
      break;
    case "Extra Large":
      num = 16;
      break;
    ;
  };
  
  // toppings
  // toppings array values - first letter indicates category so we just need to count how many Cat Group B and C toppings are chosen
  // Category A is free, so only need to count B and C; then multiply by per topping cost depending on pizza size
  var countBToppings = 0;
  var countCToppings = 0;
  pizza.toppings.forEach(function(topping){
    switch (topping.slice(0,1)) {
      case "B":
        countBToppings += 1;
        break;
      case "C":
        countCToppings += 1;
        break;
    }
  });

  switch (pizza.size) {
    case "Small":
    case "Medium":
      num += countBToppings * 0.25;
      num += countCToppings * 0.50;
      break;
    case "Large":
    case "Extra Large":
      num += countBToppings * 0.50;
      num += countCToppings * 1.00;
      break;
  }

  // set pizza price
  pizza.price = num;
};