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
 * jTPS_Unit_Tests.java
 * 
 * This file provides a test bed for the jTPS framework.
 * 
 * @author McKilla Gorilla
 * @version 2.0
 */
    
var tps = new jsTPS();
var num = new Num();

// Testing add
if (0 === num.getNum()) {
    console.log("add1")
}

// ADD 5 TRANSACTION
tps.addTransaction(new AddToNum_Transaction(num, 5));
if (5 == num.getNum()) {
    console.log("add2")
}
if (1 === tps.getSize()) {
    console.log("add3")
}
if (0 === tps.getRedoSize()) {
    console.log("add4")
}
if (1 === tps.getUndoSize()) {
    console.log("add5")
}

// ADD 10 TRANSACTION
tps.addTransaction(new AddToNum_Transaction(num, 10))
if (15 === num.getNum()) {
    console.log("add6")
}
if (2 === tps.getSize()) {
    console.log("add7")
}
if (0 === tps.getRedoSize()) {
    console.log("add8")
}
if (2 === tps.getUndoSize()) {
    console.log("add9")
}

// ADD 15 TRANSACTION
tps.addTransaction(new AddToNum_Transaction(num, 20))
if (35 === num.getNum()) {
    console.log("add10")
}
if (3 === tps.getSize()) {
    console.log("add11")
}
if (0 === tps.getRedoSize()) {
    console.log("add12")
}
if (3 === tps.getUndoSize()) {
    console.log("add13")
}

console.log("\n")

// test And Mask
var tps = new jsTPS();
var num = new Num();

if (0 === num.getNum()) {
    console.log("and1")
}

// ADD 5 TRANSACTION
tps.addTransaction(new AddToNum_Transaction(num, 12));
tps.addTransaction(new AndMask_Transaction(num, num.getNum(), 4));
if (4 === num.getNum()) {
    console.log("and2")
}
if (2 === tps.getSize()) {
    console.log("and3")
}

tps.undoTransaction()
if (12 === num.getNum()) {
    console.log("and4")
}
if (2 === tps.getSize()) {
    console.log("and5")
}
if (1 === tps.getRedoSize()) {
    console.log("and6")
}
if (1 === tps.getUndoSize()) {
    console.log("and7")
}

console.log("\n")

// test Or Mask
var tps = new jsTPS();
var num = new Num();

if (0 === num.getNum()) {
    console.log("or1")
}

// ADD 5 TRANSACTION
tps.addTransaction(new AddToNum_Transaction(num, 12));
tps.addTransaction(new OrMask_Transaction(num, num.getNum(), 4));
if (4 === num.getNum()) {
    console.log("or2")
}
if (2 === tps.getSize()) {
    console.log("or3")
}

tps.undoTransaction()
if (12 === num.getNum()) {
    console.log("or4")
}
if (2 === tps.getSize()) {
    console.log("or5")
}
if (1 === tps.getRedoSize()) {
    console.log("or6")
}
if (1 === tps.getUndoSize()) {
    console.log("or7")
}

console.log("\n")

// Testing undo
var tps = new jsTPS();
var num = new Num();

if (0 === num.getNum()) {
    console.log("undo1")
}

if (tps.hasTransactionToUndo() === false) {
    console.log("undo2")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("undo3")
}

// Add 3 transactions (5, 10, and 15)
tps.addTransaction(new AddToNum_Transaction(num, 5))
tps.addTransaction(new AddToNum_Transaction(num, 10))
tps.addTransaction(new AddToNum_Transaction(num, 20))
if (tps.hasTransactionToUndo() === true) {
    console.log("undo4")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("undo5")
}
if (35 === num.getNum()) {
    console.log("undo6")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("undo7")
}
if (3 === tps.getSize()) {
    console.log("undo8")
}
if (0 === tps.getRedoSize()) {
    console.log("undo9")
}

if (3 === tps.getUndoSize()) {
    console.log("undo10")
}

// Undo a Transaction
tps.undoTransaction();
if (tps.hasTransactionToUndo() === true) {
    console.log("undo11")
}
if (tps.hasTransactionToRedo() === true) {
    console.log("undo12")
}
if (15 === num.getNum()) {
    console.log("undo13")
}
if (3 === tps.getSize()) {
    console.log("undo14")
}
if (1 === tps.getRedoSize()) {
    console.log("undo15")
}
if (2 === tps.getUndoSize()) {
    console.log("undo16")
}

// Undo another
tps.undoTransaction();
if (tps.hasTransactionToUndo() === true) {
    console.log("undo17")
}
if (tps.hasTransactionToRedo() === true) {
    console.log("undo18")
}
if (5 === num.getNum()) {
    console.log("undo19")
}
if (3 === tps.getSize()) {
    console.log("undo20")
}
if (2 === tps.getRedoSize()) {
    console.log("undo21")
}
if (1 === tps.getUndoSize()) {
    console.log("undo22")
}

// And another
tps.undoTransaction();
if (tps.hasTransactionToUndo() === false) {
    console.log("undo23")
}
if (tps.hasTransactionToRedo() === true) {
    console.log("undo24")
}
if (0 === num.getNum()) {
    console.log("undo25")
}
if (3 === tps.getSize()) {
    console.log("undo26")
}
if (3 === tps.getRedoSize()) {
    console.log("undo27")
}
if (0 === tps.getUndoSize()) {
    console.log("undo28")
}

// We have no more to undo so this should do nothing
tps.undoTransaction();
tps.undoTransaction();
if (tps.hasTransactionToUndo() === false) {
    console.log("undo29")
}
if (tps.hasTransactionToRedo() === true) {
    console.log("undo30")
}
if (0 === num.getNum()) {
    console.log("undo31")
}
if (3 === tps.getSize()) {
    console.log("undo32")
}
if (3 === tps.getRedoSize()) {
    console.log("undo33")
}
if (0 === tps.getUndoSize()) {
    console.log("undo34")
}

console.log("\n")

// Testing redo
var tps = new jsTPS();
var num = new Num();

if (0 === num.getNum()) {
    console.log("redo1")
}

console.log("2")
console.log("3")

// Add 3 transactions (5, 10, and 15)
tps.addTransaction(new AddToNum_Transaction(num, 5))
tps.addTransaction(new AddToNum_Transaction(num, 10))
tps.addTransaction(new AddToNum_Transaction(num, 20))
if (tps.hasTransactionToUndo() === true) {
    console.log("redo4")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("redo5")
}
if (35 === num.getNum()) {
    console.log("redo6")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("redo7")
}
if (3 === tps.getSize()) {
    console.log("redo8")
}
if (0 === tps.getRedoSize()) {
    console.log("redo9")
}

if (3 === tps.getUndoSize()) {
    console.log("redo10")
}

// Undo a transaction and then redo it
tps.undoTransaction();
tps.doTransaction();
if (tps.hasTransactionToUndo() === true) {
    console.log("redo11")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("redo12")
}
if (35 === num.getNum()) {
    console.log("redo13")
}
if (3 === tps.getSize()) {
    console.log("redo14")
}
if (0 === tps.getRedoSize()) {
    console.log("redo15")
}
if (3 === tps.getUndoSize()) {
    console.log("redo16")
}

// Undo two transactions and then redo them
tps.undoTransaction();
tps.undoTransaction();
tps.doTransaction();
tps.doTransaction();
if (tps.hasTransactionToUndo() === true) {
    console.log("redo17")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("redo18")
}
if (35 === num.getNum()) {
    console.log("redo19")
}
if (3 === tps.getSize()) {
    console.log("redo20")
}
if (0 === tps.getRedoSize()) {
    console.log("redo21")
}
if (3 === tps.getUndoSize()) {
    console.log("redo22")
}

// Undo all three transactions and redo them
tps.undoTransaction();
tps.undoTransaction();
tps.undoTransaction();
tps.doTransaction();
tps.doTransaction();
tps.doTransaction();
if (tps.hasTransactionToUndo() === true) {
    console.log("redo23")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("redo24")
}
if (35 === num.getNum()) {
    console.log("redo25")
}
if (3 === tps.getSize()) {
    console.log("redo26")
}
if (0 === tps.getRedoSize()) {
    console.log("redo27")
}
if (3 === tps.getUndoSize()) {
    console.log("redo28")
}

// Undo three transactions and redo two
tps.undoTransaction();
tps.undoTransaction();
tps.undoTransaction();
tps.doTransaction();
tps.doTransaction();
if (tps.hasTransactionToUndo() === true) {
    console.log("redo29")
}
if (tps.hasTransactionToRedo() === true) {
    console.log("redo30")
}
if (15 === num.getNum()) {
    console.log("redo31")
}
if (3 === tps.getSize()) {
    console.log("redo32")
}
if (1 === tps.getRedoSize()) {
    console.log("redo33")
}
if (2 === tps.getUndoSize()) {
    console.log("redo34")
}

// Undo all three transactions and redo four, which
// should not produce an error but the last
// redo should do nothing
tps.undoTransaction();
tps.undoTransaction();
tps.undoTransaction();
tps.doTransaction();
tps.doTransaction();
tps.doTransaction();
tps.doTransaction();
if (tps.hasTransactionToUndo() === true) {
    console.log("redo29")
}
if (tps.hasTransactionToRedo() === false) {
    console.log("redo30")
}
if (35 === num.getNum()) {
    console.log("redo31")
}
if (3 === tps.getSize()) {
    console.log("redo32")
}
if (0 === tps.getRedoSize()) {
    console.log("redo33")
}
if (3 === tps.getUndoSize()) {
    console.log("redo34")
}

// Testing Clear
var tps = new jsTPS();
var num = new Num();

if (0 === num.getNum()) {
    console.log("clear1")
}

// Add 3 transactions (5, 10, and 20)
tps.addTransaction(new AddToNum_Transaction(num, 5))
tps.addTransaction(new AddToNum_Transaction(num, 10))
tps.addTransaction(new AddToNum_Transaction(num, 20))
if (35 === num.getNum()) {
    console.log("clear2")
}
if (3 === tps.getSize()) {
    console.log("clear3")
}
if (0 === tps.getRedoSize()) {
    console.log("clear4")
}

if (3 === tps.getUndoSize()) {
    console.log("clear5")
}

// Clear all the transactions
tps.clearAllTransactions();
if (35 === num.getNum()) {
    console.log("clear6")
}
if (0 === tps.getSize()) {
    console.log("clear7")
}
if (0 === tps.getRedoSize()) {
    console.log("clear8")
}
if (0 === tps.getUndoSize()) {
    console.log("clear9")
}

// Add 3 Transactions
tps.addTransaction(new AddToNum_Transaction(num, 5))
tps.addTransaction(new AddToNum_Transaction(num, 10))
tps.addTransaction(new AddToNum_Transaction(num, 20))
if (70 === num.getNum()) {
    console.log("clear10")
}
if (3 === tps.getSize()) {
    console.log("clear11")
}
if (0 === tps.getRedoSize()) {
    console.log("clear12")
}
if (3 === tps.getUndoSize()) {
    console.log("clear13")
}

// clear them all out again
tps.clearAllTransactions()
if (70 === num.getNum()) {
    console.log("clear16")
}
if (0 === tps.getSize()) {
    console.log("clear17")
}
if (0 === tps.getRedoSize()) {
    console.log("clear18")
}
if (0 === tps.getUndoSize()) {
    console.log("clear19")
}

// Add 3 Transactions
tps.addTransaction(new AddToNum_Transaction(num, 5))
tps.addTransaction(new AddToNum_Transaction(num, 10))
tps.addTransaction(new AddToNum_Transaction(num, 20))
if (105 === num.getNum()) {
    console.log("clear20")
}
if (3 === tps.getSize()) {
    console.log("clear21")
}
if (0 === tps.getRedoSize()) {
    console.log("clear22")
}
if (3 === tps.getUndoSize()) {
    console.log("clear23")
}

















