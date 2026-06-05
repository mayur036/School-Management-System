/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: Super admin school & school-admin management
 */

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a school
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Springfield High
 *               code:
 *                 type: string
 *                 example: SHS-01
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contact@springfield.edu
 *               phone:
 *                 type: string
 *                 example: "+1-555-0100"
 *               address:
 *                 type: string
 *                 example: 742 Evergreen Terrace
 *     responses:
 *       201:
 *         description: School created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a super admin)
 *       409:
 *         description: A school with this code already exists
 *   get:
 *     summary: List all schools
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schools retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a super admin)
 */

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get a single school by id
 *     tags: [Schools]
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
 *         description: School retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a super admin)
 *       404:
 *         description: School not found
 */

/**
 * @swagger
 * /api/schools/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a school
 *     tags: [Schools]
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
 *         description: School status updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a super admin)
 *       404:
 *         description: School not found
 */

/**
 * @swagger
 * /api/schools/{id}/admins:
 *   post:
 *     summary: Create a school admin for a school
 *     tags: [Schools]
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
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Jane
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.admin@springfield.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *               phone:
 *                 type: string
 *                 example: "+1-555-0101"
 *     responses:
 *       201:
 *         description: School admin created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a super admin)
 *       404:
 *         description: School not found
 *       409:
 *         description: A user with this email already exists
 */
