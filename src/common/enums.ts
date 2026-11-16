export enum VerificationStatus {
  DRAFT = 'draft',
  VERIFIED = 'verified',
  ESTIMATED = 'estimated',
  NEEDS_REVIEW = 'needs_review',
}

export enum TransportMode {
  BUS = 'bus',
  METRO = 'metro',
  MICROBUS = 'microbus',
  TAXI = 'taxi',
  RIDE_HAILING = 'ride_hailing',
  SHUTTLE = 'shuttle',
  WALKING = 'walking',
  CAR = 'car',
}

export enum ServiceType {
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
  ESSENTIAL = 'essential',
}

export enum CategoryType {
  ATTRACTION = 'attraction',
  SERVICE = 'service',
}

export enum ItineraryStatus {
  FEASIBLE = 'feasible',
  PARTIAL = 'partial',
  INFEASIBLE = 'infeasible',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum Language {
  AR = 'ar',
  EN = 'en',
}