-- Statement #1
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Statement #2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Statement #3
DELETE FROM account
WHERE account_id = 1;
-- Statement #4
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Statement #5
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';