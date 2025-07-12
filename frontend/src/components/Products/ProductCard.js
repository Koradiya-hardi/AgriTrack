import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 w-full">
        {product.images?.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mb-2 capitalize">{product.category}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-green-600 font-bold">
            ${product.price} / {product.unit}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.isAvailable ? 'Available' : 'Sold Out'}
          </span>
        </div>
        <Link
          href={`/products/${product._id}`}
          className="block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}