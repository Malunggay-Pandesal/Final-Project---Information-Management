
# Test Case 04: Lookup-only enforcement + price auto-fill tests
**Sprint**: 2  
**Description**: This test case verifies that reference data is mutation-free and that the priceHist logic correctly automates unit price entry

## Precondition

- A user with order entry permissions is logged in
- The AddLineItemModal is accessible from the order form
- The product database contains at least 3 products with priceHist entries
- Each product has multiple priceHist records with different effDates
- The system enforces lookup-only constraint on prodCode field

### Test Steps

1. Navigate to the order form and open the AddLineItemModal
2. Verify the prodCode dropdown is populated with all products from the database
3. Verify the unitPrice field is initially blank and read-only
4. Select the first product from the prodCode dropdown
5. Observe the unitPrice field auto-populate
6. Repeat steps 4-5 for the remaining products
7. For each product, verify the auto-filled price matches the priceHist entry with the latest effDate
8. Attempt to manually edit the unitPrice field and verify it's read-only
9. Close the modal without saving and reopen it to verify no state persists


### Test Data:
> Legend:
> ✅: Pass
> ❌: Fail
> ?: Confirming

| Test                       | Expected result                                                                           | Actual result | Pass/Fail |
|----------------------------|-------------------------------------------------------------------------------------------|---------------|-----------|
| Open  AddLineItemModal     | The form displays a prodCode dropdown and a blank unitPrice field.                        | The form opens with a prodCode dropdown and an empty, read-only unitPrice field. | ✅ |
| Select a specific Product. | The unitPrice field automatically populates with the correct latest price from priceHist. | The unitPrice field auto-fills after selection using the latest price history entry. | ✅ |
| Compare unitPrice to DB.   | The auto-filled price matches the priceHist entry with the MAX(effDate) for that product. | The auto-filled value matches the priceHist row with the latest effDate for the selected product. | ✅ |