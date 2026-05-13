import { asyncHandler } from '../../utils/asyncHandler.js';
import { Product } from '../products/product.model.js';
import { Transform } from 'stream';

/**
 * Controller to demonstrate streaming data from MongoDB to the client.
 * Exports products as a CSV stream.
 */
export const exportProductsCSV = asyncHandler(async (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

    // Write CSV Header
    res.write('ID,Title,Price,Category,Brand\n');

    // Use Mongoose cursor for streaming large datasets memory-efficiently
    const cursor = Product.find().cursor();

    const csvTransform = new Transform({
        objectMode: true,
        transform(product, encoding, callback) {
            const row = `${product._id},"${product.title}",${product.price},${product.category},${product.brand}\n`;
            callback(null, row);
        }
    });

    // Pipe the cursor through the transform into the response
    cursor.pipe(csvTransform).pipe(res);

    cursor.on('error', (err) => {
        res.end();
    });

    cursor.on('end', () => {
        res.end();
    });
});
