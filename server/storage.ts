import {
  type Trip,
  type InsertTrip,
  type FamilyContact,
  type InsertFamilyContact,
  type Destination,
  type InsertDestination,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Trip operations
  createTrip(trip: InsertTrip): Promise<Trip>;
  getTrip(id: string): Promise<Trip | undefined>;
  getActiveTrip(): Promise<Trip | undefined>;
  updateTripProgress(id: string, progress: number, currentStep: number): Promise<Trip | undefined>;
  completeTrip(id: string, wasComfortable?: boolean): Promise<Trip | undefined>;
  cancelTrip(id: string): Promise<Trip | undefined>;
  getTripHistory(limit?: number): Promise<Trip[]>;

  // Family contact operations
  getFamilyContacts(): Promise<FamilyContact[]>;
  getFamilyContact(id: string): Promise<FamilyContact | undefined>;
  createFamilyContact(contact: InsertFamilyContact): Promise<FamilyContact>;
  updateFamilyContact(id: string, updates: Partial<InsertFamilyContact>): Promise<FamilyContact | undefined>;
  deleteFamilyContact(id: string): Promise<boolean>;

  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getRecentDestinations(limit?: number): Promise<Destination[]>;
  getFavoriteDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: string, updates: Partial<Destination>): Promise<Destination | undefined>;
  toggleFavorite(id: string): Promise<Destination | undefined>;

  // User preferences
  getUserPreferences(): Promise<UserPreferences>;
  updateUserPreferences(updates: Partial<InsertUserPreferences>): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private trips: Map<string, Trip>;
  private familyContacts: Map<string, FamilyContact>;
  private destinations: Map<string, Destination>;
  private preferences: UserPreferences;

  constructor() {
    this.trips = new Map();
    this.familyContacts = new Map();
    this.destinations = new Map();
    
    // Initialize default preferences
    this.preferences = {
      id: randomUUID(),
      safeRouteMode: true,
      voiceGuidanceEnabled: true,
      textSize: "large",
      highContrastMode: true,
    };

    // Seed with sample data
    this.seedData();
  }

  private seedData() {
    // Sample family contacts
    const daughter: FamilyContact = {
      id: randomUUID(),
      name: "Sarah Johnson",
      phoneNumber: "+1 (555) 123-4567",
      relationship: "Daughter",
      isPrimary: true,
      familyLinkEnabled: true,
    };
    this.familyContacts.set(daughter.id, daughter);

    const son: FamilyContact = {
      id: randomUUID(),
      name: "Michael Johnson",
      phoneNumber: "+1 (555) 234-5678",
      relationship: "Son",
      isPrimary: false,
      familyLinkEnabled: false,
    };
    this.familyContacts.set(son.id, son);

    // Sample favorite destinations
    const home: Destination = {
      id: randomUUID(),
      name: "Home",
      address: "123 Oak Street, Springfield",
      type: "home",
      isFavorite: true,
      visitCount: 50,
      lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    };
    this.destinations.set(home.id, home);

    const pharmacy: Destination = {
      id: randomUUID(),
      name: "Green Valley Pharmacy",
      address: "456 Main Street, Springfield",
      type: "pharmacy",
      isFavorite: true,
      visitCount: 25,
      lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    };
    this.destinations.set(pharmacy.id, pharmacy);

    const hospital: Destination = {
      id: randomUUID(),
      name: "Springfield General Hospital",
      address: "789 Hospital Drive, Springfield",
      type: "hospital",
      isFavorite: false,
      visitCount: 8,
      lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    };
    this.destinations.set(hospital.id, hospital);

    const grocery: Destination = {
      id: randomUUID(),
      name: "Fresh Market",
      address: "321 Market Avenue, Springfield",
      type: "grocery",
      isFavorite: true,
      visitCount: 30,
      lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    };
    this.destinations.set(grocery.id, grocery);

    // Sample completed trip
    const completedTrip: Trip = {
      id: randomUUID(),
      destination: "Green Valley Pharmacy",
      destinationType: "pharmacy",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 15), // 15 min later
      status: "completed",
      progress: 100,
      currentStep: 5,
      totalSteps: 5,
      wasComfortable: true,
      safeRouteEnabled: true,
    };
    this.trips.set(completedTrip.id, completedTrip);
  }

  // Trip operations
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = randomUUID();
    const trip: Trip = {
      id,
      destination: insertTrip.destination,
      destinationType: insertTrip.destinationType,
      safeRouteEnabled: insertTrip.safeRouteEnabled ?? true,
      startTime: new Date(),
      endTime: null,
      status: "in_progress",
      progress: 0,
      currentStep: 0,
      totalSteps: insertTrip.totalSteps || 5,
      wasComfortable: null,
    };
    this.trips.set(id, trip);
    return trip;
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async getActiveTrip(): Promise<Trip | undefined> {
    return Array.from(this.trips.values()).find(
      (trip) => trip.status === "in_progress"
    );
  }

  async updateTripProgress(
    id: string,
    progress: number,
    currentStep: number
  ): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;

    trip.progress = progress;
    trip.currentStep = currentStep;
    this.trips.set(id, trip);
    return trip;
  }

  async completeTrip(
    id: string,
    wasComfortable?: boolean
  ): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;

    trip.status = "completed";
    trip.endTime = new Date();
    trip.progress = 100;
    if (wasComfortable !== undefined) {
      trip.wasComfortable = wasComfortable;
    }
    this.trips.set(id, trip);
    return trip;
  }

  async cancelTrip(id: string): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;

    trip.status = "cancelled";
    trip.endTime = new Date();
    this.trips.set(id, trip);
    return trip;
  }

  async getTripHistory(limit: number = 10): Promise<Trip[]> {
    const allTrips = Array.from(this.trips.values());
    const completedTrips = allTrips
      .filter((trip) => trip.status === "completed" || trip.status === "cancelled")
      .sort((a, b) => {
        const aTime = a.endTime?.getTime() || 0;
        const bTime = b.endTime?.getTime() || 0;
        return bTime - aTime;
      });
    return completedTrips.slice(0, limit);
  }

  // Family contact operations
  async getFamilyContacts(): Promise<FamilyContact[]> {
    return Array.from(this.familyContacts.values());
  }

  async getFamilyContact(id: string): Promise<FamilyContact | undefined> {
    return this.familyContacts.get(id);
  }

  async createFamilyContact(
    insertContact: InsertFamilyContact
  ): Promise<FamilyContact> {
    const id = randomUUID();
    const contact: FamilyContact = {
      id,
      name: insertContact.name,
      phoneNumber: insertContact.phoneNumber,
      relationship: insertContact.relationship,
      isPrimary: insertContact.isPrimary ?? false,
      familyLinkEnabled: insertContact.familyLinkEnabled ?? false,
    };
    this.familyContacts.set(id, contact);
    return contact;
  }

  async updateFamilyContact(
    id: string,
    updates: Partial<InsertFamilyContact>
  ): Promise<FamilyContact | undefined> {
    const contact = this.familyContacts.get(id);
    if (!contact) return undefined;

    const updated = { ...contact, ...updates };
    this.familyContacts.set(id, updated);
    return updated;
  }

  async deleteFamilyContact(id: string): Promise<boolean> {
    return this.familyContacts.delete(id);
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getRecentDestinations(limit: number = 4): Promise<Destination[]> {
    const allDestinations = Array.from(this.destinations.values());
    return allDestinations
      .filter((dest) => dest.lastVisited !== null)
      .sort((a, b) => {
        const aTime = a.lastVisited?.getTime() || 0;
        const bTime = b.lastVisited?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }

  async getFavoriteDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(
      (dest) => dest.isFavorite
    );
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(
    insertDestination: InsertDestination
  ): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = {
      id,
      name: insertDestination.name,
      address: insertDestination.address,
      type: insertDestination.type,
      isFavorite: insertDestination.isFavorite ?? false,
      visitCount: 0,
      lastVisited: null,
    };
    this.destinations.set(id, destination);
    return destination;
  }

  async updateDestination(
    id: string,
    updates: Partial<Destination>
  ): Promise<Destination | undefined> {
    const destination = this.destinations.get(id);
    if (!destination) return undefined;

    const updated = { ...destination, ...updates };
    this.destinations.set(id, updated);
    return updated;
  }

  async toggleFavorite(id: string): Promise<Destination | undefined> {
    const destination = this.destinations.get(id);
    if (!destination) return undefined;

    destination.isFavorite = !destination.isFavorite;
    this.destinations.set(id, destination);
    return destination;
  }

  // User preferences
  async getUserPreferences(): Promise<UserPreferences> {
    return this.preferences;
  }

  async updateUserPreferences(
    updates: Partial<InsertUserPreferences>
  ): Promise<UserPreferences> {
    this.preferences = { ...this.preferences, ...updates };
    return this.preferences;
  }
}

export const storage = new MemStorage();
