import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertTripSchema,
  insertFamilyContactSchema,
  insertDestinationSchema,
  insertUserPreferencesSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Trip endpoints
  app.post("/api/trips", async (req, res) => {
    try {
      const data = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(data);
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Invalid trip data" });
    }
  });

  app.get("/api/trips/active", async (req, res) => {
    const trip = await storage.getActiveTrip();
    if (!trip) {
      return res.status(404).json({ error: "No active trip" });
    }
    res.json(trip);
  });

  app.get("/api/trips/history", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const trips = await storage.getTripHistory(limit);
    res.json(trips);
  });

  app.patch("/api/trips/:id/progress", async (req, res) => {
    try {
      const { progress, currentStep } = req.body;
      const trip = await storage.updateTripProgress(
        req.params.id,
        progress,
        currentStep
      );
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  app.post("/api/trips/:id/complete", async (req, res) => {
    try {
      const { wasComfortable } = req.body;
      const trip = await storage.completeTrip(req.params.id, wasComfortable);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Failed to complete trip" });
    }
  });

  app.post("/api/trips/feedback", async (req, res) => {
    try {
      const { wasComfortable } = req.body;
      const activeTrip = await storage.getActiveTrip();
      
      if (!activeTrip) {
        return res.status(404).json({ error: "No active trip to provide feedback for" });
      }

      const trip = await storage.completeTrip(activeTrip.id, wasComfortable);
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Failed to submit feedback" });
    }
  });

  app.post("/api/trips/:id/cancel", async (req, res) => {
    try {
      const trip = await storage.cancelTrip(req.params.id);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Failed to cancel trip" });
    }
  });

  // Family contact endpoints
  app.get("/api/family-contacts", async (req, res) => {
    const contacts = await storage.getFamilyContacts();
    res.json(contacts);
  });

  app.get("/api/family-contacts/:id", async (req, res) => {
    const contact = await storage.getFamilyContact(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  });

  app.post("/api/family-contacts", async (req, res) => {
    try {
      const data = insertFamilyContactSchema.parse(req.body);
      const contact = await storage.createFamilyContact(data);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.patch("/api/family-contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateFamilyContact(req.params.id, req.body);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/family-contacts/:id", async (req, res) => {
    const deleted = await storage.deleteFamilyContact(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ success: true });
  });

  // Destination endpoints
  app.get("/api/destinations", async (req, res) => {
    const destinations = await storage.getDestinations();
    res.json(destinations);
  });

  app.get("/api/destinations/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
    const destinations = await storage.getRecentDestinations(limit);
    res.json(destinations);
  });

  app.get("/api/destinations/favorites", async (req, res) => {
    const destinations = await storage.getFavoriteDestinations();
    res.json(destinations);
  });

  app.get("/api/destinations/:id", async (req, res) => {
    const destination = await storage.getDestination(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.json(destination);
  });

  app.post("/api/destinations", async (req, res) => {
    try {
      const data = insertDestinationSchema.parse(req.body);
      const destination = await storage.createDestination(data);
      res.json(destination);
    } catch (error) {
      res.status(400).json({ error: "Invalid destination data" });
    }
  });

  app.patch("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.updateDestination(req.params.id, req.body);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(400).json({ error: "Failed to update destination" });
    }
  });

  app.post("/api/destinations/:id/toggle-favorite", async (req, res) => {
    try {
      const destination = await storage.toggleFavorite(req.params.id);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(400).json({ error: "Failed to toggle favorite" });
    }
  });

  // User preferences endpoints
  app.get("/api/preferences", async (req, res) => {
    const preferences = await storage.getUserPreferences();
    res.json(preferences);
  });

  app.patch("/api/preferences", async (req, res) => {
    try {
      const preferences = await storage.updateUserPreferences(req.body);
      res.json(preferences);
    } catch (error) {
      res.status(400).json({ error: "Failed to update preferences" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
