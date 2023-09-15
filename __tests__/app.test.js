const { groceryList, returnData, pushList, editList, deleteItem } = require('../src/app')

const testItem = {
    name: "apple",
    quantity: 1,
    price: 2.99,
    bought: false,
};
describe('display list', () => {
    /*beforeAll(async () => {
    });*/

    afterAll(async () => {
        groceryList.splice(0,groceryList.length);
    });

    test('list should be empty at the start', async () => {
        let result = returnData(groceryList);
        expect(result).toBe("[]");
    });

    test('should display list with one item', async() => {
        groceryList.push(testItem);
        let result = returnData(groceryList);
        expect(result).toBe("[{\"name\":\"apple\",\"quantity\":1,\"price\":2.99,\"bought\":false}]")
        
    });
});

describe('add to list', () => {

    afterAll(async () => {
        groceryList.splice(0,groceryList.length);
    });

    test('list should have 1 item after adding', async () => {
        pushList(testItem);
        expect(groceryList.length).toBe(1);
    });
});

describe('PUT Testing', () => {
    const newItem = {
        name: "apple",
        quantity: 3,
        price: 3.99,
        bought: true,
    };

    beforeAll(async () => {
        groceryList.push(testItem);
    });

    afterAll(async () => {
        groceryList.splice(0,groceryList.length);
    });

    test('old item should become new item after editing', async () => {
        editList(0,newItem);
        expect(groceryList[0]).toStrictEqual({"bought": true, "name": "apple", "price": 3.99, "quantity": 3});
    });
  });

  describe('DELETE Testing', () => {
    beforeEach(async () => {
        groceryList.push(testItem);
    });
    
    afterEach(async () => {
        groceryList.splice(0,groceryList.length);
    });
    test('should delete test item from the grocery list', async () => {
        let result = deleteItem(0);
        expect(groceryList.length).toBe(0);
    });

    test('the item deleted should be same as test item', async () => {
        let result = deleteItem(0);
        expect(testItem).toBe(result);
    });
  });