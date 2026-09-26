import { test } from "node:test";
import assert from "node:assert/strict";
import { chronologyDate } from "../../src/utils/projectChronology.ts";

test("authored date precision overrides geometry dates, including month and range labels", () => {
	assert.equal(chronologyDate({ date: "2012-01-09", date_label: "January 2012" }), "January 2012");
	assert.equal(
		chronologyDate({
			date: "2013-06-01",
			end_date: "2013-10-31",
			date_label: "Summer–autumn 2013",
		}),
		"Summer–autumn 2013",
	);
});

test("dated records without display labels retain their full range in UTC", () => {
	assert.equal(
		chronologyDate({ date: "2007-01-09", end_date: "2007-01-11" }),
		"Jan 9, 2007 – Jan 11, 2007",
	);
	assert.equal(chronologyDate({ date: "2007-11-07" }), "Nov 7, 2007");
});
