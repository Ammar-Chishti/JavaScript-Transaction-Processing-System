/**
 * jTPS.java
 * 
 * This class is used for managing an abstract transaction processing
 * system for the purpose of managing an undo/redo system for an
 * application. Note that one must specify all work done via custom
 * transactions.
 * 
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 2.0
 */
class jsTPS {

    // THE TRANSACTION STACK
    transactions = []
    
    // KEEPS TRACK OF WHERE WE ARE IN THE STACK, THUS AFFECTING WHAT
    // TRANSACTION MAY BE DONE OR UNDONE AT ANY GIVEN TIME
    mostRecentTransaction = -1;
    
    // THESE VARIABLES CAN BE TURNED ON AND OFF TO SIGNAL THAT
    // DO AND UNDO OPERATIONS ARE BEING PERFORMED
    performingDo = false;
    performingUndo = false;

    /**
     * Tests to see if the do (i.e. redo) operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * @return true if the do (i.e. redo) operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingDo() {
        return this.performingDo;
    }
    
    /**
     * Tests to see if the undo operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * @return true if the undo operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingUndo() {
        return this.performingUndo;
    }
    
    /**
     * This function adds the transaction argument to the top of
     * the transaction processing system stack and then executes it. Note that it does
     * When this method has completed transaction will be at the top 
     * of the stack, it will have been completed, and the counter have
     * been moved accordingly.
     * 
     * @param transaction The custom transaction to be added to
     * the transaction processing system stack and executed.
     */
    addTransaction(transaction) {
        // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
        // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
        if ((this.mostRecentTransaction < 0) || (this.mostRecentTransaction < (this.transactions.length-1))) {
            for (var i = this.transactions.length-1; i > this.mostRecentTransaction; i--) {
                this.transactions.splice(i, 1)
            }
        }

        // AND NOW ADD THE TRANSACTION
        this.transactions.push(transaction);

        // AND EXECUTE IT
        this.doTransaction();        
    }

    /**
     * This function executes the transaction at the location of the counter,
     * then moving the TPS counter. Note that this may be the transaction
     * at the top of the TPS stack or somewhere in the middle (i.e. a redo).
     */
    doTransaction() {
        if (this.hasTransactionToRedo()) {
            this.performingDo = true;
            this.transaction = this.transactions[this.mostRecentTransaction+1];
            this.transaction.doTransaction();
            this.mostRecentTransaction++;
            this.performingDo = false;
        }
    }
    
    /**
     * This function checks to see if there is a transaction to undo. If there
     * is it will return it, if not, it will return null.
     * 
     * @return The transaction that would be executed if undo is performed, if
     * there is no transaction to undo, null is returned.
     */
    peekUndo() {
        if (this.hasTransactionToUndo()) {
            return this.transactions[mostRecentTransaction];
        }
        else
            return null;
    }
    
    /**
     * This function checks to see if there is a transaction to redo. If there
     * is it will return it, if not, it will return null.
     * 
     * @return The transaction that would be executed if redo is performed, if
     * there is no transaction to undo, null is returned.
     */    
    peekDo() {
        if (this.hasTransactionToRedo()) {
            return this.transactions[mostRecentTransaction+1];
        }
        else
            return null;
    }

    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
    undoTransaction() {
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            this.transaction = this.transactions[this.mostRecentTransaction];
            this.transaction.undoTransaction();
            this.mostRecentTransaction--;
            this.performingUndo = false;
        }
    }

    /**
     * This method clears all transactions from the TPS stack
     * and resets the counter that keeps track of the location
     * of the top of the stack.
     */
    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        //this.transactions.clear();
        this.transactions = []
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;        
    }
    
    /**
     * Accessor method that returns the number of transactions currently
     * on the transaction stack. This includes those that may have been
     * done, undone, and redone.
     * 
     * @return The number of transactions currently in the transaction stack.
     */
    getSize() {
        return this.transactions.length;
    }
    
    /**
     * This method returns the number of transactions currently in the
     * transaction stack that can be redone, meaning they have been added
     * and done, and then undone.
     * 
     * @return The number of transactions in the stack that can be redone.
     */
    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

    /**
     * This method returns the number of transactions currently in the 
     * transaction stack that can be undone.
     * 
     * @return The number of transactions in the transaction stack that
     * can be undone.
     */
    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be undone at the time this function is called.
     * 
     * @return true if an undo operation is possible, false otherwise.
     */
    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be redone at the time this function is called.
     * 
     * @return true if a redo operation is possible, false otherwise.
     */
    hasTransactionToRedo() {
        return this.mostRecentTransaction < (this.transactions.length-1);
    }
        
    /**
     * This method builds and returns a textual summary of the current
     * Transaction Processing System, this includes the toString of
     * each transaction in the stack.
     * 
     * @return A textual summary of the TPS.
     */
    toString() {
        let text = "--Number of Transactions: " + this.transactions.length + "\n";
        text += "--Current Index on Stack: " + this.mostRecentTransaction + "\n";
        text += "--Current Transaction Stack:\n";
        for (let i = 0; i <= this.mostRecentTransaction; i++) {
            let jT = transactions[i];
            text += "----" + this.jT.toString() + "\n";
        }
        return text;
    }
}

/**
 * Num.java
 *
 * This class serves as the data class that our transactions will manipulate.
 * It's just an integer wrapper class.
 *
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 2.0
 */
class Num {

    // THE NUMBER THIS CLASS MANAGES
    num = 0;

    /**
     * Mutator method for the num instance variable.
     *
     * @param initNum The value to set num to.
     */
    setNum(initNum) {
        this.num = initNum
    }

    /**
     * Accessor method for num.
     *
     * @return The num instance variable value.
     */
    getNum() {
        return this.num
    }

    andMask(mask) {
        this.num = this.num & mask;
    }

    orMask(mask) {
        this.num = this.num | mask;
    }
}

/**
 * AddToNum_Transaction.java
 * 
 * This class is a transaction that can be executed and undone. It
 * can be stored in the jTPS transaction stack and must be constructed
 * with all the data necessary to perform both do and undo.
 * 
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 2.0
 */
class AddToNum_Transaction {

    // THIS IS THE OBJECT IT WILL MANIPULATE
    num = null;
    
    // AMOUNT TO ADD/REMOVE FOR NUM
    amountToAdd = null;

    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initNum
     * @param initAmountToAdd 
     */
    constructor (initNum, initAmountToAdd) {
        // KEEP THESE FOR LATER
        this.num = initNum;
        this.amountToAdd = initAmountToAdd;
    }

    /**
     * This transaction simply adds the value to the num.
     */
    doTransaction() {
        let oldNum = this.num.getNum();
        let newNum = oldNum + this.amountToAdd;
        this.num.setNum(newNum);
    }

    /**
     * As the reverse of do, this method substracts from num.
     */
    undoTransaction() {
        let oldNum = num.getNum();
        let newNum = oldNum - this.amountToAdd;
        this.num.setNum(newNum);
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return "Add " + amountToAdd;
    }
}

/**
 *
 * @author McKillaGorilla
 */
class AndMask_Transaction {
    // THIS IS THE OBJECT IT WILL MANIPULATE
    num;
    
    intNum;
    
    // AMOUNT TO MASK FOR NUM
    mask;

    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initNum
     * @param initAmountToAdd 
     */
    constructor(initNum, initIntNum, initMask) {
        // KEEP THESE FOR LATER
        this.num = initNum;
        this.intNum = initIntNum;
        this.mask = initMask;
    }

    /**
     * This transaction simply adds the value to the num.
     */
    doTransaction() {
        this.num.andMask(this.mask);
    }

    /**
     * As the reverse of do, this method substracts from num.
     */
    undoTransaction() {
        this.num.setNum(this.intNum);
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return "And Mask " + this.mask;
    }
}

/**
 *
 * @author McKillaGorilla
 */
class OrMask_Transaction {
    // THIS IS THE OBJECT IT WILL MANIPULATE
    num;
    
    intNum;
    
    // AMOUNT TO MASK FOR NUM
    mask;

    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initNum
     * @param initAmountToAdd 
     */
    constructor(initNum, initIntNum, initMask) {
        // KEEP THESE FOR LATER
        this.num = initNum;
        this.intNum = initIntNum;
        this.mask = initMask;
    }

    /**
     * This transaction simply adds the value to the num.
     */
    
    doTransaction() {
        this.num.orMask(this.mask);
    }

    /**
     * As the reverse of do, this method substracts from num.
     */
    undoTransaction() {
        this.num.setNum(this.intNum);
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return "Or Mask " + this.mask;
    }
}





/**
 * This driver demonstrates simple usage of the jTPS API.
 * 
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 2.0
 */
//class jsTPS_Tester {
//}


document.addEventListener('DOMContentLoaded', function() {

    tps = new jsTPS();
    num = new Num();

    // tps.addTransaction(new AddToNum_Transaction(num, 27));
    // console.log(tps.transactions)
    // console.log(tps.mostRecentTransaction)
    // tps.undoTransaction();
    // console.log(tps.transactions)
    // console.log(tps.mostRecentTransaction)

    
    document.getElementById("add").addEventListener("click", addButtonHandle)
    document.getElementById("input").value = "";
    
    function addButtonHandle() {
        let stringInput = document.getElementById("input").value
        document.getElementById("input").value = "";
        let inputNumber = parseInt(stringInput)
        let transaction = new AddToNum_Transaction(num, inputNumber);
        tps.addTransaction(transaction);
        displayInfo();
    }

    document.getElementById("undo").addEventListener("click", undoButtonHandle)
    
    function undoButtonHandle() {
        tps.undoTransaction();
        displayInfo();
    }

    document.getElementById("redo").addEventListener("click", redoButtonHandle)

    function redoButtonHandle() {
        tps.doTransaction();
        displayInfo();
    }

    document.getElementById("clear").addEventListener("click", clearButtonHandle)

    function clearButtonHandle() {
        tps.clearAllTransactions();
        displayInfo();
    }

    document.getElementById("reset").addEventListener("click", resetButtonHandle)

    function resetButtonHandle() {
        tps.clearAllTransactions();
        num.setNum(0);
        displayInfo();
    }

    function displayInfo() {
        document.getElementById("num_transactions").innerHTML = tps.getSize();
        document.getElementById("index_on_stack").innerHTML = tps.mostRecentTransaction
        document.getElementById("num").innerHTML = num.getNum();

        var transactionStack = document.getElementById("current_transaction_stack");
        transactionStack.innerHTML = ""

        for (var i = 0; i < tps.mostRecentTransaction + 1; i++) {
                transactionStack.appendChild(document.createTextNode("----Add " + tps.transactions[i].amountToAdd))
                transactionStack.appendChild(document.createElement("br"))
        }
    }


 }, false);
