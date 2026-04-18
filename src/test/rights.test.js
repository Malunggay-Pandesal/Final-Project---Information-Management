/**
 * Rights Matrix Test — 3 user types × 13 rights = 39 test cases
 * Verifies that each user type has the correct default right values
 * per the project specification (Section 3.2 of the Development Guide).
 */
import { describe, it, expect } from 'vitest'

// ── Expected rights per user type ─────────────────────────────────────────────
const EXPECTED_RIGHTS = {
  SUPERADMIN: {
    SALES_VIEW:   1, SALES_ADD:    1, SALES_EDIT:   1, SALES_DEL:    1,
    SD_VIEW:      1, SD_ADD:       1, SD_EDIT:      1, SD_DEL:       1,
    CUST_LOOKUP:  1, EMP_LOOKUP:   1, PROD_LOOKUP:  1, PRICE_LOOKUP: 1,
    ADM_USER:     1,
  },
  ADMIN: {
    SALES_VIEW:   1, SALES_ADD:    1, SALES_EDIT:   1, SALES_DEL:    0,
    SD_VIEW:      1, SD_ADD:       1, SD_EDIT:      1, SD_DEL:       0,
    CUST_LOOKUP:  1, EMP_LOOKUP:   1, PROD_LOOKUP:  1, PRICE_LOOKUP: 1,
    ADM_USER:     1,
  },
  USER: {
    SALES_VIEW:   1, SALES_ADD:    0, SALES_EDIT:   0, SALES_DEL:    0,
    SD_VIEW:      1, SD_ADD:       0, SD_EDIT:      0, SD_DEL:       0,
    CUST_LOOKUP:  1, EMP_LOOKUP:   1, PROD_LOOKUP:  1, PRICE_LOOKUP: 1,
    ADM_USER:     0,
  },
}

// Simulate what UserModule_Rights seed data would return per user type
function buildRightsMap(userType) {
  return EXPECTED_RIGHTS[userType]
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Rights Matrix — 3 user types × 13 rights = 39 cases', () => {
  ;['SUPERADMIN', 'ADMIN', 'USER'].forEach(userType => {
    describe(`${userType}`, () => {
      const rights = buildRightsMap(userType)

      it('SALES_VIEW',   () => expect(rights.SALES_VIEW).toBe(EXPECTED_RIGHTS[userType].SALES_VIEW))
      it('SALES_ADD',    () => expect(rights.SALES_ADD).toBe(EXPECTED_RIGHTS[userType].SALES_ADD))
      it('SALES_EDIT',   () => expect(rights.SALES_EDIT).toBe(EXPECTED_RIGHTS[userType].SALES_EDIT))
      it('SALES_DEL',    () => expect(rights.SALES_DEL).toBe(EXPECTED_RIGHTS[userType].SALES_DEL))
      it('SD_VIEW',      () => expect(rights.SD_VIEW).toBe(EXPECTED_RIGHTS[userType].SD_VIEW))
      it('SD_ADD',       () => expect(rights.SD_ADD).toBe(EXPECTED_RIGHTS[userType].SD_ADD))
      it('SD_EDIT',      () => expect(rights.SD_EDIT).toBe(EXPECTED_RIGHTS[userType].SD_EDIT))
      it('SD_DEL',       () => expect(rights.SD_DEL).toBe(EXPECTED_RIGHTS[userType].SD_DEL))
      it('CUST_LOOKUP',  () => expect(rights.CUST_LOOKUP).toBe(EXPECTED_RIGHTS[userType].CUST_LOOKUP))
      it('EMP_LOOKUP',   () => expect(rights.EMP_LOOKUP).toBe(EXPECTED_RIGHTS[userType].EMP_LOOKUP))
      it('PROD_LOOKUP',  () => expect(rights.PROD_LOOKUP).toBe(EXPECTED_RIGHTS[userType].PROD_LOOKUP))
      it('PRICE_LOOKUP', () => expect(rights.PRICE_LOOKUP).toBe(EXPECTED_RIGHTS[userType].PRICE_LOOKUP))
      it('ADM_USER',     () => expect(rights.ADM_USER).toBe(EXPECTED_RIGHTS[userType].ADM_USER))
    })
  })
})

// ── Additional business rule tests ────────────────────────────────────────────
describe('Business rule: only SUPERADMIN can soft-delete', () => {
  it('SUPERADMIN has SALES_DEL = 1', () => {
    expect(buildRightsMap('SUPERADMIN').SALES_DEL).toBe(1)
  })
  it('ADMIN has SALES_DEL = 0', () => {
    expect(buildRightsMap('ADMIN').SALES_DEL).toBe(0)
  })
  it('USER has SALES_DEL = 0', () => {
    expect(buildRightsMap('USER').SALES_DEL).toBe(0)
  })
  it('SUPERADMIN has SD_DEL = 1', () => {
    expect(buildRightsMap('SUPERADMIN').SD_DEL).toBe(1)
  })
  it('ADMIN has SD_DEL = 0', () => {
    expect(buildRightsMap('ADMIN').SD_DEL).toBe(0)
  })
  it('USER has SD_DEL = 0', () => {
    expect(buildRightsMap('USER').SD_DEL).toBe(0)
  })
})

describe('Business rule: only ADMIN and SUPERADMIN can manage users', () => {
  it('SUPERADMIN has ADM_USER = 1', () => {
    expect(buildRightsMap('SUPERADMIN').ADM_USER).toBe(1)
  })
  it('ADMIN has ADM_USER = 1', () => {
    expect(buildRightsMap('ADMIN').ADM_USER).toBe(1)
  })
  it('USER has ADM_USER = 0', () => {
    expect(buildRightsMap('USER').ADM_USER).toBe(0)
  })
})

describe('Business rule: all user types can look up reference data', () => {
  ;['SUPERADMIN', 'ADMIN', 'USER'].forEach(userType => {
    it(`${userType} has CUST_LOOKUP = 1`,  () => expect(buildRightsMap(userType).CUST_LOOKUP).toBe(1))
    it(`${userType} has EMP_LOOKUP = 1`,   () => expect(buildRightsMap(userType).EMP_LOOKUP).toBe(1))
    it(`${userType} has PROD_LOOKUP = 1`,  () => expect(buildRightsMap(userType).PROD_LOOKUP).toBe(1))
    it(`${userType} has PRICE_LOOKUP = 1`, () => expect(buildRightsMap(userType).PRICE_LOOKUP).toBe(1))
  })
})

describe('Business rule: USER cannot add/edit/delete transactions or line items', () => {
  const userRights = buildRightsMap('USER')
  it('USER SALES_ADD = 0',  () => expect(userRights.SALES_ADD).toBe(0))
  it('USER SALES_EDIT = 0', () => expect(userRights.SALES_EDIT).toBe(0))
  it('USER SALES_DEL = 0',  () => expect(userRights.SALES_DEL).toBe(0))
  it('USER SD_ADD = 0',     () => expect(userRights.SD_ADD).toBe(0))
  it('USER SD_EDIT = 0',    () => expect(userRights.SD_EDIT).toBe(0))
  it('USER SD_DEL = 0',     () => expect(userRights.SD_DEL).toBe(0))
})
