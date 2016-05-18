/*
 *  Dev testcases when adding duk_harray
 *
 *  https://github.com/svaarala/duktape/pull/703
 */

/*===
array literal test
3
1,2,3
===*/

function arrayLiteralTest() {
    var arr;

    arr = [ 1, 2, 3 ];
    print(arr.length);
    print(arr);
}

try {
    print('array literal test');
    arrayLiteralTest();
} catch (e) {
    print(e.stack || e);
}

/*===
array constructor test
10 [null,null,null,null,null,null,null,null,null,null]
10 [null,null,null,null,null,"foo",null,null,null,null]
6 [1,2,3,"foo","bar","quux"]
6 [1,2,3,"foo","bar","baz"]
===*/

function arrayConstructorTest() {
    var arr;

    // Create Array using numeric argument
    arr = new Array(10);
    print(arr.length, JSON.stringify(arr));
    arr[5] = 'foo';
    print(arr.length, JSON.stringify(arr));

    // Create Array from initializer arguments
    arr = new Array(1, 2, 3, 'foo', 'bar', 'quux');
    print(arr.length, JSON.stringify(arr));
    arr[5] = 'baz';
    print(arr.length, JSON.stringify(arr));
}

try {
    print('array constructor test');
    arrayConstructorTest();
} catch (e) {
    print(e.stack || e);
}

/*===
array enumeration test
0,1,2,3,length
0,1,2,3
0,1,2,3,4,length
0,1,2,3,4
0,1,2,3,4,length,foo
0,1,2,3,4,foo
===*/

function arrayEnumerationTest() {
    var arr;

    arr = [ 1,2,3,4 ];
    print(Object.getOwnPropertyNames(arr));
    print(Object.keys(arr));
    arr[4] = 5;
    print(Object.getOwnPropertyNames(arr));
    print(Object.keys(arr));
    arr.foo = 'bar';
    print(Object.getOwnPropertyNames(arr));
    print(Object.keys(arr));
}

try {
    print('array enumeration test');
    arrayEnumerationTest();
} catch (e) {
    print(e.stack || e);
}

/*===
array .length property descriptor test
6 true false false
6 [1,2,3,4,5,6]
5 [1,2,3,4,5]
5 [1,2,3,4,5]
5 [1,2,3,4,5]
5 false false false
defineProperty
5 [1,2,3,4,5]
5 [1,2,3,4,5]
TypeError: array length non-writable
TypeError: not configurable
TypeError: not configurable
TypeError: not configurable
TypeError: not configurable
2 [null,null]
===*/

function arrayLengthPropertyDescriptorTest() {
    var arr, pd;

    // Make .length non-writable.
    arr = [ 1, 2, 3, 4, 5, 6 ];
    pd = Object.getOwnPropertyDescriptor(arr, 'length');
    print(pd.value, pd.writable, pd.enumerable, pd.configurable);
    print(arr.length, JSON.stringify(arr));
    arr.length = 5;
    print(arr.length, JSON.stringify(arr));
    Object.defineProperty(arr, 'length', { writable: false });
    print(arr.length, JSON.stringify(arr));
    arr.length = 4;
    print(arr.length, JSON.stringify(arr));
    pd = Object.getOwnPropertyDescriptor(arr, 'length');
    print(pd.value, pd.writable, pd.enumerable, pd.configurable);
    print('defineProperty');
    try {
        Object.defineProperty(arr, 'length', { value: 5 });  // no change, ok
        print(arr.length, JSON.stringify(arr));
    } catch (e) {
        print(e.stack || e);
    }
    try {
        Object.defineProperty(arr, 'length', { value: 5, writable: false, enumerable: false, configurable: false });  // no change, ok
        print(arr.length, JSON.stringify(arr));
    } catch (e) {
        print(e.stack || e);
    }
    try {
        Object.defineProperty(arr, 'length', { value: 4 });  // Not OK
        print('never here');
        print(arr.length, JSON.stringify(arr));
    } catch (e) {
        //print(e.stack);
        print(e);
    }
    try {
        Object.defineProperty(arr, 'length', { writable: true });  // Not OK
        print('never here');
        print(arr.length, JSON.stringify(arr));
    } catch (e) {
        //print(e.stack);
        print(e);
    }
    try {
        Object.defineProperty(arr, 'length', { enumerable: true });  // Not OK
        print('never here');
        print(arr.length, JSON.stringify(arr));
    } catch (e) {
        //print(e.stack);
        print(e);
    }
    try {
        Object.defineProperty(arr, 'length', { configurable: true });  // Not OK
        print('never here');
        print(arr.length, JSON.stringify(arr));
    } catch (e) {
        //print(e.stack);
        print(e);
    }
    try {
        Object.defineProperty(arr, 'length', { set: function () {}, get: function () {} });  // Not OK
        print('never here');
        print(arr.length, JSON.stringify(arr));
    } catch (e) {
        //print(e.stack);
        print(e);
    }

    // Set .length using Object.defineProperty().
    arr = [];
    Object.defineProperty(arr, 'length', { value: 2 });
    print(arr.length, JSON.stringify(arr));

    // FIXME: go through diff for more applicable tests
}

try {
    print('array .length property descriptor test');
    arrayLengthPropertyDescriptorTest();
} catch (e) {
    print(e.stack || e);
}

/*===
array length test
false
TypeError: not configurable
4
4
true
0,1,2,length
true

1,2,3,4,5,6,7,8,9,10
1,2,3,4,5,foo,7,8,9,10
TypeError: not writable
1,2,3,4,5,foo,7,8,9,10
===*/

function arrayLengthTest() {
    var arr;
    var obj;

    // Attempt to delete Array .length fails; result false in non-strict
    // mode, error in strict mode.
    arr = [ 1, 2, 3, 4, 5 ];
    print(delete arr.length);
    try {
        (function deleteTest() { 'use strict'; delete arr.length; })();
    } catch (e) {
        //print(e.stack);
        print(e);
    }

    // Attempt to write a non-writable Array .length.
    arr = [ 1, 2, 3, 4 ];
    Object.defineProperty(arr, 'length', { writable: false });
    print(arr.length);
    arr.length = 2;
    print(arr.length);

    // Property existence for Array .length.
    arr = [ 1, 2, 3 ];
    print('length' in arr);
    print(Object.getOwnPropertyNames(arr));
    obj = Object.create(arr);  // inherit from 'arr'
    print('length' in obj);
    print(Object.getOwnPropertyNames(obj));

    // Writing to an Array when .length is write protected.
    arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
    Object.defineProperty(arr, 'length', { writable: false });
    print(arr);
    arr[5] = 'foo';  // OK, length not changed
    print(arr);
    try {
        arr[10] = 'foo';
    } catch (e) {
        //print(e.stack);
        print(e);
    }
    print(arr);
}

try {
    print('array length test');
    arrayLengthTest();
} catch (e) {
    print(e.stack || e);
}

/*===
enumeration order for sparse arrays
0,1,2,length
0,1,2
0,1,2,length,foo
0,1,2,foo
length,0,1,2,foo
0,1,2,foo
length,0,1,2,foo,bar
0,1,2,foo,bar
===*/

/* The enumeration order for sparse arrays (= arrays whose array part has been
 * abandoned) changes with the introduction of duk_harray.  The enumeration
 * order is: (1) array part, (2) virtual .length property, (3) entry part.
 * The virtual .length only comes into play when also non-enumerable own
 * properties are listed, e.g. Object.getOwnPropertyNames() is used.
 *
 * For a three-member dense array this would result in the enumeration order
 * 0,1,2,length.  When that array becomes sparse, Duktape 1.x would still
 * enumerate it as 0,1,2,length because .length was stored explicitly and
 * could thus be moved to the entry part.  Duktape 2.x has a virtual Array
 * .length and the sparse array will thus enumerate as length,0,1,2.
 *
 *     ((o) Duktape 1.5.0 (v1.4.0-421-g8e90d3d-dirty)
 *     duk> a = [1,2,3]; a[100] = 1; a.length = 3;
 *     = 3
 *     duk> Object.getOwnPropertyNames(a)
 *     = 0,1,2,length
 *
 *     ((o) Duktape [linenoise] 1.99.99 (v1.5.0-168-g86373ab-dirty)
 *     duk> a = [1,2,3]; a[100] = 1; a.length = 3;
 *     = 3
 *     duk> Object.getOwnPropertyNames(a)
 *     = length,0,1,2
 */

function sparseArrayEnumTest() {
    var arr;

    arr = [ 1, 2, 3 ];
    print(Object.getOwnPropertyNames(arr));
    print(Object.keys(arr));

    arr.foo = 'bar';
    print(Object.getOwnPropertyNames(arr));
    print(Object.keys(arr));

    arr[100] = 1; arr.length = 3;  // make sparse
    print(Object.getOwnPropertyNames(arr));
    print(Object.keys(arr));

    arr.bar = 'quux';
    print(Object.getOwnPropertyNames(arr));
    print(Object.keys(arr));
}

try {
    print('enumeration order for sparse arrays');
    sparseArrayEnumTest();
} catch (e) {
    print(e.stack || e);
}

/*===
Array.prototype test
[object Array]
[object Array]
0 foo bar quux undefined
0 foo undefined undefined undefined
0 undefined undefined undefined undefined
dummy
undefined
===*/

function arrayPrototypeTest() {
    var arr;

    // Array.prototype is an Array instance.
    // This is useful to check for ROM built-ins.
    print(Object.prototype.toString.call([]));
    print(Object.prototype.toString.call(Array.prototype));

    // It can also be written to (unusual but required).
    Array.prototype.push('foo', 'bar', 'quux');
    arr = [];
    print(arr.length, arr[0], arr[1], arr[2], arr[3]);
    Array.prototype.length = 1;
    print(arr.length, arr[0], arr[1], arr[2], arr[3]);
    Array.prototype.length = 0;
    print(arr.length, arr[0], arr[1], arr[2], arr[3]);

    // Array.prototype is dense by default; make it sparse.
    //print(Duktape.enc('jx', Duktape.info(Array.prototype)));
    Array.prototype[1000] = 'dummy';
    //print(Duktape.enc('jx', Duktape.info(Array.prototype)));
    arr = [];
    print(arr[1000]);
    Array.prototype.length = 0;
    //print(Duktape.enc('jx', Duktape.info(Array.prototype)));
    print(arr[1000]);
}

try {
    print('Array.prototype test');
    arrayPrototypeTest();
} catch (e) {
    print(e.stack || e);
}

/*===
===*/

function arrayMiscTest() {
    var arr;

    // Creating an Array with a small count creates a dense array
    // with a preallocated array part.
    arr = new Array(100);
    print(arr.length);

    // Creating an Array with a huge count creates a dense array
    // but with no preallocated array part.
    arr = new Array(1e9);
    print(arr.length);
}

try {
    arrayMiscTest();
} catch (e) {
    print(e.stack || e);
}
