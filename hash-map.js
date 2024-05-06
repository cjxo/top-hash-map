// NOTE:
//  <> So, from what I understand, Hash Maps are a generalizations of arrays.
//  <> We generate indices (as hashes) from keys (like string). 
//  <> Now, if the range of hash values are large or infinite, storing buckets of that
//     size is very impractical because computer memory is limited.
//  <> We need a smaller set of keys, with size m, which is a subset of the large or infinite set of keys.
//  <> Thus, the storage requirement will be a nice O(m).
//
//  What is a hash function?
//  <> we denote h as the hash function and k as key.
//  <> The goal of the hash function is to map keys inside the large or possibly inifinite set of keys into 
//     a limited number of slots in the Hash Map with size m.
//  <> The output must be deterministic. That is, same input k must output same output h(k).
//                _________________
//                |               |
//    "Carlos" -> | Hash function | -> 12
//                |               |
//                -----------------
//  There is one downside: Collisions, where two keys may hash to the same slot / bucket.
//  <> Well the preferred hash function h's output must appear random from the range 0, ..., m - 1.
//      <> That is, each key is equally likely to hash onto any of the m slots.
//  <> But, this does not avoid collisions at all (impossible, in fact).
//  <> Algorithms people created two common solutions: collision resolution by chaining and collision
//     resolution by open addressing. My implementation will use chaining (using linked list).
//
//  Collision Resolution by Chaining.
//  <> SUppose we have m buckets and n elements. Then, hash function must in theory divide n elements randomly
//     into m buckets, where each bucket has an approximate size of n / m. This ratio n / m is called the load factor.
//      <> As said in Odin Project, if n / m >= 0.75, we resize the buckets.
//  <> Each bucket is a linked list. When two elements hash into the same bucket, they both go into the same linked list,
//     AND THUS ARE "CHAINED" TOGETHER:
//        (Element 0) <-> (Element 1) <-> ... <-> (Element x).
//  Ok, lets implement chained hash table

import { LinkedList } from "./linked-list.js";

function defaultHashFunction(stringAsKey, bucketCount) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < stringAsKey.length; ++i) {
        hashCode = (hashCode * primeNumber + stringAsKey.charCodeAt(i)) % bucketCount;
    }

    return hashCode;
}

// In this method, bucketCount can be any number > 0.
function multiplicationHashFunction(stringAsKey, bucketCount) {
    const A = 0.631312491412;
    const value = defaultHashFunction(stringAsKey, bucketCount) * A;
    const hash = Math.floor(bucketCount * (value - Math.floor(value)));
    return(hash);
}

function HashMap(hashFn=defaultHashFunction) {
    let buckets = null;
   
    resize(16);

    function loadFactor() {
        return length() / buckets.length;
    }

    function resize(bucketCount) {
        buckets = new Array(bucketCount);
        for (let i = 0; i < buckets.length; ++i) {
            buckets[i] = LinkedList();
        }
    }

    function resizeBucketsIfNeeded() {
        if (loadFactor() >= 0.75) {
            let elements = entries();
            resize(buckets.length * 2);

            elements.forEach(({ key, value }) => {
                set(key, value);
            });
        }
    }

    function set(key, value) {
        resizeBucketsIfNeeded();
        let hash = hashFn(key, buckets.length);
        buckets[hash].append(key, value);
    }

    function get(key) {
        let result = buckets[hashFn(key, buckets.length)].search(key);
        if (result) {
            return result.value;
        } else {
            return null;
        }
    }

    function has(key) {
        return buckets[hashFn(key, buckets.length)].search(key) !== null;
    }

    function remove(key) {
        let toRemove = buckets[hashFn(key, buckets.length)].search(key);
        if (toRemove) {
            buckets[hashFn(key, buckets.length)].remove(toRemove);
            return true;
        } else {
            return false;
        }
    }

    function length() {
        let result = 0;
        buckets.forEach(list => {
            result += list.length;
        });
        return result;
    }

    function clear() {
        buckets.forEach(element => {
            element.clear();
        });
    }

    function keys() {
        let result = [];
        buckets.forEach(list => {
            list.forEach(node => {
                result.push(node.key);
            });
        });

        return result;
    }

    function values() {
        let result = [];
        buckets.forEach(list => {
            list.forEach(node => {
                result.push(node.value);
            });
        });

        return result;
    }

    function entries() {
        let result = [];
        buckets.forEach(list => {
            list.forEach(node => {
                result.push({ key: node.key, value: node.value });
            });
        });

        return result;
    }

    function printBuckets() {
        console.log(`load factor: ${loadFactor()}`);
        buckets.forEach((list, idx) => {
            console.log(`-- bucket ${idx} --`);

            let str = "";
            list.forEach(node => {
                str += `(key: ${node.key}, value: ${node.value}) -> `;
            });
            
            str += "(null)";
            console.log(str);
        });
    }
    
    return { loadFactor, set, get, has, remove, length, clear, keys, values, entries, printBuckets };
}

//let hashMap = HashMap(multiplicationHashFunction);
let hashMap = HashMap();

hashMap.set("Hello", 16);
hashMap.set("Hello", 17);
hashMap.set("Hello", "HAHA");
hashMap.set("bruha", "HAHA");
hashMap.set("Place", "DisneyLand");
hashMap.set("Movie", "Pirates Of The Carribean");
hashMap.set("Food0", "Pizza");
hashMap.set("Symbol Table", "In Compilers");
hashMap.set("Food1", "Burger");
hashMap.set("Food2", "Burger");
hashMap.set("Instrument", "Guitar");
hashMap.set("Can I store an array0?", ["Yes", "You", "Can"]);
hashMap.set("Can I store an array1?", ["Yes", "You", "Can"]);
//hashMap.set("Can I store an array2?", ["Yes", "You", "Can"]);
//hashMap.set("Instrument1", "Guitar");
console.log(hashMap.printBuckets());
console.log(hashMap.keys());
console.log(hashMap.values());

console.log(hashMap.has("Instrument"));
hashMap.remove("Instrument");
console.log(hashMap.has("Instrument"));

console.log(hashMap.get("Place"));
hashMap.set("Instrument2", "Drums");
console.log(hashMap.printBuckets());
