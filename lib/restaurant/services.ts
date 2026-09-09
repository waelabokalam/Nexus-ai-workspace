import "server-only";

// Compatibility facade for existing routes/actions. Feature modules must import
// their owning service directly instead of depending on this aggregate module.
export { getRestaurantCommandCenter } from "@/lib/restaurant/command-center/service";
export {
  ingestRestaurantEvent,
  manageRestaurantMember,
  processManagerApproval,
  updateManagerAttentionItem,
  writeRestaurantActivity,
} from "@/lib/restaurant/core/operations";
export { ingestRestaurantReview } from "@/lib/restaurant/reputation/service";
