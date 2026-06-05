/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: School admin staff management (scoped to own school)
 */

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Register a staff member in the admin's own school
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - department_id
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               department_id:
 *                 type: integer
 *                 example: 1
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.smith@springfield.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Staff@123
 *               phone:
 *                 type: string
 *                 example: "+1-555-0102"
 *     responses:
 *       201:
 *         description: Staff registered successfully
 *       400:
 *         description: Validation failed, or department does not belong to your school
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a school admin)
 *       409:
 *         description: A user with this email already exists
 *   get:
 *     summary: List staff of the admin's own school
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a school admin)
 */

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get a single staff member of the admin's own school
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Staff retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a school admin)
 *       404:
 *         description: Staff member not found
 */

/**
 * @swagger
 * /api/staff/{id}/status:
 *   patch:
 *     summary: Enable or disable a staff member of the admin's own school
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Staff status updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a school admin)
 *       404:
 *         description: Staff member not found
 */
