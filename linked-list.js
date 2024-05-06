function LinkedListNode(key, value) {
    let next = null;
    let prev = null;
    return {
        key, value, next, prev
    };
}

// This linked list is specifically crafted for our HashMap.
function LinkedList() {
    let firstNode = null;
    let lastNode = null;
    let nodeCount = 0;

    function search(key) {
        let currentNode = firstNode;
        while (currentNode && (currentNode.key !== key)) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }

    function append(key, value) {
        let nodeToReturn = null;
        for (let currentNode = firstNode; currentNode; currentNode = currentNode.next) {
            // If a key already exists, then the old value is overwritten or we can say that we update the key’s value
            if (currentNode.key === key) {
                currentNode.value = value;
                nodeToReturn = currentNode;
                break;
            }
        }

        if (!nodeToReturn) {
            let newNode = LinkedListNode(key, value);
            newNode.next = firstNode;

            if (firstNode) {
                firstNode.prev = newNode;
            }

            firstNode = newNode;

            if (lastNode === null) {
                lastNode = firstNode;
            }

            nodeToReturn = firstNode;
            
            ++nodeCount;
        }

        return nodeToReturn;
    }

    function remove(node) {
        if (nodeCount) {
            --nodeCount;
            if (node.prev === null) {
                firstNode = node.next;
                node.next.prev = null;
            } else {
                node.prev.next = node.next;
            }

            if (node.next === null) {
                lastNode = node.prev;
                node.prev.next = null;
            } else {
                node.next.prev = node.prev;
            }
        } 
    }

    function clear() {
        // Garbage Collection in the back, right?
        firstNode = null;
        lastNode = null;
        nodeCount = 0;
    }

    // callback takes in a LinkedListNode.
    function forEach(callback) {
        for (let currentNode = firstNode; currentNode; currentNode = currentNode.next) {
            callback(currentNode);
        }
    }

    return {
        search,
        append,
        remove,
        clear,
        forEach,
        get length() {
            return nodeCount;
        }
    };
}

export { LinkedListNode, LinkedList };
