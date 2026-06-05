/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: School admin department management (scoped to own school)
 */

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a department in the admin's own school
 *     tags: [Departments]
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
 *                 example: Mathematics
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a school admin)
 *       409:
 *         description: A department with this name already exists in the school
 *   get:
 *     summary: List departments of the admin's own school
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a school admin)
 */
