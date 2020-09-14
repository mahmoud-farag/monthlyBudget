// budget Controller
const budgetController = (function () {
  // create a model for income data object
  const Income = function (ID, description, value) {
    // console.log(isNaN(ID)); //true
    this.ID = ID;
    this.description = description;
    this.value = value;
  };

  // create a model for expense data object
  const Expense = function (ID, description, value) {
    // console.log(isNaN(ID)); //true
    this.ID = ID;
    this.description = description;
    this.value = value;
  };

  // an Obj holds all the data
  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    totalBudget: 0,
    // -1 means that the percentage variable not exist
    percentage: -1,
    // holds the expenses percentage for every single item;
    percentages: [],
  };

  var updateTotal = function (value, type) {
    //  return data.totals[type] += value;

    if (type === "inc") {
      data.totals["inc"] += value;
      data.total += value;
    } else if (type === "exp") {
      data.totals["exp"] += value;
      data.total -= value;
    }
    return data.totals;
  };

  const calcTotalIncAndExp = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (item) {
      sum += item.value;
    });

    data.totals[type] = sum;
  };
  // public functions and object
  return {
    addItem: function (type, description, value) {
      var newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = parseInt(
          data.allItems[type][data.allItems[type].length - 1].ID + 1
        );
      } else {
        ID = 0;
      }
      // console.log(isNaN(ID));  // isNaN() used to check if value is not a number or not
      // which caused due to add number + string || number + undefined
      if (type === "exp") {
        newItem = new Expense(ID, description, value);
      } else if (type === "inc") {
        newItem = new Income(ID, description, value);
      }

      data.allItems[type].push(newItem);

      return newItem;
    },

    deleteItem: function (type, itemID) {
      let ids, index, deletedItem;

      ids = data.allItems[type].map(function (item) {
        return item.ID;
      });

      if (index !== -1) {
        index = ids.indexOf(itemID);

        //the plice method used to delete specific item/ items from an array
        deletedItem = data.allItems[type].splice(index, 1);
      } else {
        console.log("item not found in array");
      }

      return deletedItem;
    },
    addToTotal: function (value, type) {
      return updateTotal(value, type);
    },
    calcBudget: function () {
      // calc total income && total expense
      calcTotalIncAndExp("inc");
      calcTotalIncAndExp("exp");

      // calc the total budget which is Income - Expense
      data.totalBudget = data.totals.inc - data.totals.exp;

      // calc the expense percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calcPercentages: function () {
      // calc the exp percentage for every item and store them in an array
      data.percentages = data.allItems.exp.map(function (item) {
        let value;
        if (data.totals.inc > 0) {
          value = Math.round((item.value / data.totals.inc) * 100);
        } else {
          value = 0;
        }

        console.log(value);
        return value;
      });
    },
    getPercentages: function () {
      return data.percentages;
    },
    testing: function () {
      console.log(data);
    },
    getBudget: function () {
      return {
        totalBudget: data.totalBudget,
        percentage: data.percentage,
        totalIncome: data.totals.inc,
        totalExpense: data.totals.exp,
      };
    },

    // wrong step, you can not make your data public, you destroy the encapsulation role
    // data: data,
  };
})(); // End budget Controller

//////////////////////////////////////
//////////////////////////////////////
// User Interface Controller
//////////////////////////////////////
//////////////////////////////////////
const UIController = (function () {
  /*
   * make your dom in one single object, to make it easy if you want to change
   * any class name in html file , so you will change it only in one single place
   */
  const Dom = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomesList: ".income__list",
    expensesList: ".expenses__list",
    totalBudget: ".budget__value",
    totalIncome: ".budget__income--value",
    totalExpense: ".budget__expenses--value",
    percentage: ".budget__expenses--percentage",
    container: ".container",
    itemPercentage: ".item__percentage",
    date: ".budget__title--month",
    item: ".item",
  };

  const getInputFromUI = function () {
    return {
      type: document.querySelector(Dom.inputType).value,
      description: document.querySelector(Dom.inputDescription).value,
      value: parseFloat(document.querySelector(Dom.inputValue).value),
    };
  };

  const injectElementToUI = function (object, type) {
    let HTMLString = "",
      list = "";

    // check if the object is Income or Expense
    if (type === "inc") {
      HTMLString = `<div class="item clearfix" id="inc-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix"><div class="item__value">%value%</div>
                      <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">
                          </i></button>
                      </div>
                    </div>
                  </div>`;
      list = Dom.incomesList;
    } else if (type === "exp") {
      HTMLString = `<div class="item clearfix" id="exp-%id%">
                       <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                 <button class="item__delete--btn"><i class="ion-ios-close-outline">
                                  </i>
                                 </button>
                        </div>
                      </div>
                  </div>`;
      list = Dom.expensesList;
    } else {
      console.log("the type: " + type + ", is not correct");
    }
    // inject the actual data into the html String
    HTMLString = HTMLString.replace("%id%", object.ID); // the replace method return new updating string
    HTMLString = HTMLString.replace("%description%", object.description);
    HTMLString = HTMLString.replace(
      "%value%",
      numberFormat(object.value, type)
    );

    // inject the html string into the DOM using the insertAdjacentHTML() func

    document.querySelector(list).insertAdjacentHTML("beforeend", HTMLString);
  };

  var clearInputFields = function () {
    /*
    type = document.querySelector(Dom.inputType).value = "inc";
    document.querySelector(Dom.inputDescription).value = "";
    document.querySelector(Dom.inputValue).value = "";
    */

    //////////////////////////////////////////////////////////
    // another functionality to clear the input fields
    /////////////////////////////////////////////////////////

    //  1. fetch all the input fields
    var inputFields = document.querySelectorAll(
      Dom.inputDescription + "," + Dom.inputValue
    );

    /* 2. covert the list which the querySelectorAll returned to an array
           fields is a list not an array which means that you will not be able to use belt-in functions
           the only way to covert the list to array is to use the slice method using the Array 
          global object from its prototype which all the arrays inherit it 
       */
    var inputFieldsArray = Array.prototype.slice.call(inputFields);

    // 3. clear the fields
    /* 
          now you can yous the foreach array method to loop throw all the inputFields and clear its values
        */

    inputFieldsArray.forEach((element) => {
      element.value = "";
    });

    // return the focus to the description field
    inputFieldsArray[0].focus();
  };

  var UIMainSection = function (data) {
    var type = data.totalBudget > 0 ? "inc" : "exp";
    document.querySelector(Dom.totalBudget).textContent = numberFormat(
      data.totalBudget,
      type
    );
    document.querySelector(Dom.totalIncome).textContent = numberFormat(
      data.totalIncome,
      "inc"
    );
    document.querySelector(Dom.totalExpense).innerHTML = numberFormat(
      data.totalExpense,
      "exp"
    );

    if (data.percentage > 0) {
      document.querySelector(Dom.percentage).textContent =
        data.percentage + "%";
    } else {
      document.querySelector(Dom.percentage).textContent = "---";
    }
  };

  var numberFormat = function (number, type) {
    var integer, decimal, splits;

    number = Math.abs(number);
    number = number.toFixed(2);
    console.log(number);
    splits = number.split(".");
    console.log(splits);
    integer = splits[0];
    decimal = splits[1];

    if (integer.length > 3) {
      integer =
        integer.substr(0, integer.length - 3) +
        "," +
        integer.substr(integer.length - 3, 3);
    }

    return (type === "exp" ? "-" : "+") + " " + integer + "." + decimal;
  };

  // public methods and objects
  return {
    getInput: function () {
      return getInputFromUI();
    },
    injectToUI: function (object, type) {
      return injectElementToUI(object, type);
    },
    clearInput: function () {
      return clearInputFields();
    },
    updateUIMainSection: function (data) {
      return UIMainSection(data);
    },
    deleteItem: function (itemId) {
      //this the best way to delete item from the UI using the DOM
      let item = document.getElementById(itemId);
      item.parentNode.removeChild(item);
    },
    updatePercentages: function (percentages) {
      let labelsList, labelsArr;
      // this query will return an list not an array which means you need to convert the list
      // to an array to be able to use the built-in function forEach .
      //
      labelsList = document.querySelectorAll(Dom.itemPercentage);

      // converting the list to an array using the slice method from the global Array object .
      // ! . there are another functionality to convert the list to an array. please see the course
      labelsArr = Array.prototype.slice.call(labelsList);

      labelsArr.forEach(function (label, index) {
        if (percentages[index] > 0) {
          label.textContent = percentages[index] + " %";
        } else {
          label.textContent = "---";
        }
      });
    },

    toggleInputFocusColor: function () {
      var inputFields, inputFieldsArr;

      // 1. get the html input fields
      inputFields = document.querySelectorAll(
        Dom.inputType + "," + Dom.inputValue + "," + Dom.inputDescription
      );
      console.log(inputFields);
      inputFieldsArr = Array.prototype.slice.call(inputFields);

      // 2. loop throw them and toggle the color using css classes
      inputFieldsArr.forEach(function (element) {
        element.classList.toggle("red-focus");
      });

      // 3. toggle the button color also

      document.querySelector(Dom.addBtn).classList.toggle("red");
    },
    Dom: Dom,
  };
})(); //End UI CTRL

//////////////////////////////////////
//////////////////////////////////////
// the main Controller
//////////////////////////////////////
//////////////////////////////////////
const controller = (function (budgetCtrl, UICtrl) {
  const Dom = UICtrl.Dom;
  const initializeApp = function () {
    // Give focus to a text field, immediately after the document window has been loaded
    window.onload = function () {
      document.querySelector(Dom.inputDescription).focus();
    };

    document.querySelector(Dom.addBtn).addEventListener("click", manageAdding);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 14) {
        manageAdding();
      }
    });

    //this eventListener using the Event Bubbling && Event Delegation concepts. please remember what is this
    document
      .querySelector(Dom.container)
      .addEventListener("click", deleteItemAndUpdateIU);

    // add event listener to toggle the input fields  focus color from blue to red and vis versa

    document
      .querySelector(Dom.inputType)
      .addEventListener("change", UICtrl.toggleInputFocusColor);
  };

  const deleteItemAndUpdateIU = function () {
    let itemID, item, type, id, deletedItem;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    //doing this logic only if the clicked tag is contains the item ID
    if (itemID) {
      /*
       * firstly split the itemID into type && index
       */
      item = itemID.split("-");
      type = item[0];
      id = parseInt(item[1]);
      console.log(type + " : " + id);
      // 1. delete item from the budget data array.
      deletedItem = budgetCtrl.deleteItem(type, id);

      // 2. delete item from the UI.
      UICtrl.deleteItem(itemID);
      // 3. re-calculate the budget again.and update the main section UI
      updateBudgetAndUI();
      updateBudgetAndUI();
    }
  };

  const updateBudgetAndUI = function () {
    // calculate budget
    budgetCtrl.calcBudget();
    // get budget
    let budgetObj = budgetCtrl.getBudget();
    console.log(budgetObj);

    // display budget to the UI
    UICtrl.updateUIMainSection(budgetObj);
  };

  const manageAdding = function () {
    var newItem;
    // 1. getting data from ui
    const input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. add the Income or Expense obj to budget Controller and returned the object again after the insert operation
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. inject the Income or Expense obj to the UI
      UICtrl.injectToUI(newItem, input.type);

      // 4. clear input field after user has clicked  Enter
      UICtrl.clearInput();

      /*//  5. updating the budget controller
       budgetCtrl.addToTotal(input.value, input.type);

      //  6. update the UI Controller
       UICtrl.updateUIMainSection(budgetCtrl.data);*/

      // 5 && 6. update budget and UI
      updateBudgetAndUI();
      // 6. calc percentage for each exp obj
      calcPercentages();
    } else {
      console.log("the input fields must not be empty");
    }
  };

  const calcPercentages = function () {
    let percentages;
    // 1. calc firstly for each expense object

    budgetCtrl.calcPercentages();

    // 2. get the all expenses percentage
    percentages = budgetCtrl.getPercentages();
    console.log(percentages);
    // 3. update the UI
    UICtrl.updatePercentages(percentages);
  };

  const setDate = () => {
    var date = new Date();

    var months = [
      "يناير",
      "فبراير",
      "مارس",
      "ابريل",
      "مايو",
      "يونية",
      "يوليو",
      "اغسطس",
      "سبتمبر",
      "اكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    document.querySelector(Dom.date).textContent =
      months[date.getMonth()] + "-" + date.getFullYear();
  };

  return {
    init: function () {
      initializeApp();
      // set the main section labels to be Zeroes
      UICtrl.updateUIMainSection({
        totalBudget: 0,
        percentage: -1,
        totalIncome: 0,
        totalExpense: 0,
      });
      setDate();
      console.log("App is started");
    },
  };
})(budgetController, UIController);

// initialize my App
controller.init();
