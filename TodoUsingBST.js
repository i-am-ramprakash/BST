import readline from "readline";

class taskNode{
    constructor(priority, task){
        this.priority = priority;
        this.task = task;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class taskBSTtree{
    constructor(){
        this.root = null;
    }

    height(node){
        return node ? node.height : 0;
    }

    getBalance(node){
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    rightRotate(y){
        const x = y.left;
        y.left = x.right;
        x.right = y;

        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        return x;
    }

    leftRotate(x){
        const y = x.right;
        x.right = y.left;
        y.left = x;

        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        return y;
    }

    insert(node, priority, task){
        if(!node){
            return new taskNode(priority, task);
        }

        if(priority < node.priority){
            node.left = this.insert(node.left, priority, task);
        }else if(priority > node.priority){
            node.right = this.insert(node.right, priority, task);
        }else{
            return node;
        }

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        const balance = this.getBalance(node);

        if(balance > 1 && priority < node.left.priority){
            return this.rightRotate(node);
        }

        if(balance < -1 && priority > node.right.priority){
            return this.leftRotate(node);
        }

        if(balance > 1 && priority > node.left.priority){
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        if(balance < -1 && priority < node.right.priority){
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    delete(node, priority){
        if(!node){
            return node;
        }

        if(priority < node.priority){
            node.left = this.delete(node.left, priority);
        }else if(priority > node.priority){
            node.right = this.delete(node.right, priority);
        }else{
            if(!node.left || !node.right) return node.left || node.right;
                let temp = node.right;
                while(temp.left) temp = temp.left;
                node.priority = temp.priority;
                node.task = temp.task;
                node.right = this.delete(node.right, temp.priority);
            }

        if(!node) return node;
        

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        const balance = this.getBalance(node);

        if(balance > 1 && this.getBalance(node.left) >= 0){
            return this.rightRotate(node);
        }

        if(balance > 1 && this.getBalance(node.left) < 0){
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        if(balance < -1 && this.getBalance(node.right) <= 0){
            return this.leftRotate(node);
        }

        if(balance < -1 && this.getBalance(node.right) > 0){
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    update(node, oldPriority, newPriority){
        let taskToUpdate = this.search(node, oldPriority);
        if(!taskToUpdate){
            console.log("Task Not Found");
            return node;
    }
    const taskDesc = taskToUpdate.task;
    node = this.delete(node, oldPriority);
    node = this.insert(node, newPriority, taskDesc);
    return node;
    }

    search(node, priority){
        if(!node || node.priority === priority) return node;
        if(priority < node.priority) return this.search(node.left, priority);
        return this.search(node.right, priority);
        }

    inOrder(node){
        if(node){
            this.inOrder(node.left);
            console.log(`Priority: ${node.priority}, Task: ${node.task}`);
            this.inOrder(node.right);
        }
    }
}
 /*const taskTree = new taskBSTtree();
 const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
 });

const promptUser = () => {
    rl.question("Enter  Your Option (insert,delete,update,view,exit): ", (command) => {
        if(command === "exit"){
            rl.close();
            return;
        }
        if(command === "view"){
            console.log("Your Task in Sorted order:");
            taskTree.inOrder(taskTree.root);
            promptUser();
            return;
        }
       rl.question("Enter Priority and Task: ", (values) => {
        const inputs = values.split(" ");
        const priority = parseInt(inputs[0]);
        const task = inputs.slice(1).join(" ");

        if(command === "insert"){
            taskTree.root = taskTree.insert(taskTree.root, priority, task);
       }else if(command === "delete"){
           taskTree.root = taskTree.delete(taskTree.root, priority);
        }else if(command === "update"){
            rl.question("Enter New Priority: ", (newPriority) => {
            taskTree.root = taskTree.update(taskTree.root, priority, parseInt(newPriority));
            promptUser();
        });
        return;   
    }
    promptUser();
    });
});
};
 promptUser();*/
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const taskTree = new taskBSTtree();
let priorities = Array.from({ length: 500 }, (_, i) => i + 1);
shuffle(priorities);


priorities.forEach((priority) => {
    taskTree.root = taskTree.insert(taskTree.root, priority, `Task ${priority}`);
});


for (let i = 1; i <= 400; i++) {
    taskTree.root = taskTree.delete(taskTree.root, i);
}


const searchPriority = 405;
const result = taskTree.search(taskTree.root, searchPriority);

console.log("Tasks after deletion (in sorted order):");
taskTree.inOrder(taskTree.root);

if (result) {
    console.log(`\nSearching for priority: ${result.priority}, Task: ${result.task}`);
} else {
    console.log(`\nTask with priority ${searchPriority} not found.`);
}
