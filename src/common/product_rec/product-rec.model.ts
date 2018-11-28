import mongoose from 'mongoose';
import { toGraphCallback } from '../utilities';

// Stub
const fitSizeSchema = new mongoose.Schema({
  id: String!,
  label: String!,
  localeCode: String!,
  secondLabel: String,
  sizeType: String!,
  system: String!,
});

const productRecSchema = new mongoose.Schema({
  profileId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  styleId: {
    type: String,
    required: true,
  },
  rankId: {
    type: String,
    required: true,
  },
  fitSize: {
    type: fitSizeSchema,
    required: true,
  },
});

/**
 * This property will ensure our virtuals (including "id")
 * are set on the user when we use it.
 */
productRecSchema.set('toObject', { virtuals: true });

/**
 * This is a helper method which converts mongoose properties
 * from objects to strings, numbers, and booleans.
 */
productRecSchema.method('toGraph', toGraphCallback);

/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export const ProductRecFitSize = mongoose.model('ProductRecFitSize', fitSizeSchema);
export const ProductRec = mongoose.model('ProductRec', productRecSchema);