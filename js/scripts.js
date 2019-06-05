// ************************ front end logic ************************ 
var pizza;

$(document).ready(function(){
  // set default pizza
  pizza = new Pizza;
  pizza.size = $("input:radio[name=size]:checked").val();
  $("input:checkbox[name=toppings]:checked").each(function(){
    pizza.toppings.push($(this).val());
  });

  // when name is changed
  $("input#name").change(function() {
    pizza.name = $("input#name").val().toUpperCase();
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
  });
  
  
});

// updates output 
var displayOutput = function(pizza){
  if (pizza.name) {
    $("span#output-name").text(pizza.name + "'s") ;
  } else {
    $("span#output-name").text("Your");  
  };

  // topping value has the Category Letter : Topping name (like B:Onions) so need to slice
  var toppingHTML = "";
  pizza.toppings.forEach(function(topping){
    toppingHTML += "<li>" + topping.slice(2) + "</li>";
  });
  $("span#output-toppings").html(toppingHTML);
  
  $("span#output-size").text(pizza.size);
  $("span#output-price").text(pizza.price.toFixed(2));
  $("div#div-output").show();
};


// ************************ biz logic ************************ 
function Pizza(){
  this.name = "";
  this.size = "";
  this.toppings = [];
  this.price = 0.00;
};


// when Make My Pizza button is clicked, verify all required inputs
var blnValidOrder = function(pizza) {
  return false;
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
    case "Extra-Large":
      num += countBToppings * 0.50;
      num += countCToppings * 1.00;
      break;
  }

  // set pizza price
  pizza.price = num;
};