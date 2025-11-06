import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Trip schema - represents a navigation session
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destination: text("destination").notNull(),
  destinationType: text("destination_type").notNull(), // 'pharmacy', 'hospital', 'home', 'other'
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'cancelled'
  progress: integer("progress").notNull().default(0), // 0-100
  currentStep: integer("current_step").notNull().default(0),
  totalSteps: integer("total_steps").notNull().default(5),
  wasComfortable: boolean("was_comfortable"), // trip feedback
  safeRouteEnabled: boolean("safe_route_enabled").notNull().default(true),
});

// Family contacts
export const familyContacts = pgTable("family_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  relationship: text("relationship").notNull(), // 'son', 'daughter', 'spouse', etc.
  isPrimary: boolean("is_primary").notNull().default(false),
  familyLinkEnabled: boolean("family_link_enabled").notNull().default(false),
});

// Recent/favorite destinations
export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(), // 'pharmacy', 'hospital', 'grocery', 'home', 'friend', 'other'
  isFavorite: boolean("is_favorite").notNull().default(false),
  visitCount: integer("visit_count").notNull().default(0),
  lastVisited: timestamp("last_visited"),
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  safeRouteMode: boolean("safe_route_mode").notNull().default(true),
  voiceGuidanceEnabled: boolean("voice_guidance_enabled").notNull().default(true),
  textSize: text("text_size").notNull().default("large"), // 'medium', 'large', 'extra-large'
  highContrastMode: boolean("high_contrast_mode").notNull().default(true),
});

// Insert schemas
export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  startTime: true,
}).extend({
  destination: z.string().min(1, "Please enter a destination"),
});

export const insertFamilyContactSchema = createInsertSchema(familyContacts).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Please enter a name"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  visitCount: true,
  lastVisited: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

// Types
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export type InsertFamilyContact = z.infer<typeof insertFamilyContactSchema>;
export type FamilyContact = typeof familyContacts.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
