import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Text "mo:base/Text";
import List "mo:base/List";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";

persistent actor ChefKnifeWorks {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Storage for file uploads
  let storage = Storage.new();
  include MixinStorage(storage);

  // Reservation system types
  public type Reservation = {
    id : Text;
    customerName : Text;
    contactInfo : Text;
    date : Text;
    timeSlot : Text;
    status : Text;
    createdAt : Int;
    assignedStaff : ?Principal;
    notes : Text;
  };

  public type DropOffRecord = {
    reservationId : Text;
    customerName : Text;
    contactInfo : Text;
    photo : ?Storage.ExternalBlob;
    quantity : Nat;
    verified : Bool;
    timestamp : Int;
  };

  public type PickupStatus = {
    reservationId : Text;
    paymentStatus : Text;
    pickupConfirmed : Bool;
    timestamp : Int;
  };

  public type ContactFormSubmission = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    category : Text;
    timestamp : Int;
    handled : Bool;
  };

  public type ServicePricing = {
    standard : Nat;
    premium : Nat;
    specialty : Nat;
    volumeDiscounts : [(Nat, Nat)];
    addOns : [(Text, Nat)];
  };

  // Initialize OrderedMap operations
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  // Storage for reservations, drop-offs, pickups, contact forms, and pricing
  var reservations = textMap.empty<Reservation>();
  var dropOffRecords = textMap.empty<DropOffRecord>();
  var pickupStatuses = textMap.empty<PickupStatus>();
  var contactForms = textMap.empty<ContactFormSubmission>();
  var servicePricing = textMap.empty<ServicePricing>();

  // Reservation system functions
  // Public access - customers can create reservations without authentication
  public shared func createReservation(reservation : Reservation) : async () {
    // No authorization check - public access for customer-facing reservation system
    reservations := textMap.put(reservations, reservation.id, reservation);
  };

  // Public access - customers can look up reservations by ID/phone/email
  public query func getReservation(id : Text) : async ?Reservation {
    // No authorization check - public access for customer lookup
    textMap.get(reservations, id);
  };

  // Staff access - both staff and admin can view all reservations
  public query ({ caller }) func getAllReservations() : async [Reservation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can view all reservations");
    };
    var list = List.nil<Reservation>();
    for ((_, reservation) in textMap.entries(reservations)) {
      list := List.push(reservation, list);
    };
    List.toArray(list);
  };

  // Staff access - both staff and admin can update reservation status and assign staff
  public shared ({ caller }) func updateReservationStatus(id : Text, status : Text, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can update reservation status");
    };
    switch (textMap.get(reservations, id)) {
      case (null) { Debug.trap("Reservation not found") };
      case (?reservation) {
        let updatedReservation = {
          reservation with
          status;
          notes;
          assignedStaff = ?caller;
        };
        reservations := textMap.put(reservations, id, updatedReservation);
      };
    };
  };

  // Drop-off system functions
  // Public access - customers can create drop-off records when dropping off knives
  public shared func createDropOffRecord(record : DropOffRecord) : async () {
    // No authorization check - public access for customer drop-off process
    dropOffRecords := textMap.put(dropOffRecords, record.reservationId, record);
  };

  // Public access - customers can look up drop-off records by reservation ID
  public query func getDropOffRecord(reservationId : Text) : async ?DropOffRecord {
    // No authorization check - public access for customer lookup
    textMap.get(dropOffRecords, reservationId);
  };

  // Staff access - both staff and admin can view all drop-off records for CRM management
  public query ({ caller }) func getAllDropOffRecords() : async [DropOffRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can view all drop-off records");
    };
    var list = List.nil<DropOffRecord>();
    for ((_, record) in textMap.entries(dropOffRecords)) {
      list := List.push(record, list);
    };
    List.toArray(list);
  };

  // Staff access - both staff and admin can verify drop-off records
  public shared ({ caller }) func verifyDropOff(reservationId : Text, verified : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can verify drop-offs");
    };
    switch (textMap.get(dropOffRecords, reservationId)) {
      case (null) { Debug.trap("Drop-off record not found") };
      case (?record) {
        let updatedRecord = { record with verified };
        dropOffRecords := textMap.put(dropOffRecords, reservationId, updatedRecord);
      };
    };
  };

  // Pickup portal functions
  // Staff access - both staff and admin can update pickup status
  public shared ({ caller }) func updatePickupStatus(status : PickupStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can update pickup status");
    };
    pickupStatuses := textMap.put(pickupStatuses, status.reservationId, status);
  };

  // Public access - customers can check pickup status by reservation ID
  public query func getPickupStatus(reservationId : Text) : async ?PickupStatus {
    // No authorization check - public access for customer pickup verification
    textMap.get(pickupStatuses, reservationId);
  };

  // Staff access - both staff and admin can view all pickup statuses for CRM management
  public query ({ caller }) func getAllPickupStatuses() : async [PickupStatus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can view all pickup statuses");
    };
    var list = List.nil<PickupStatus>();
    for ((_, status) in textMap.entries(pickupStatuses)) {
      list := List.push(status, list);
    };
    List.toArray(list);
  };

  // Contact form functions
  // Public access - anyone can submit contact forms
  public shared func submitContactForm(form : ContactFormSubmission) : async () {
    // No authorization check - public access for customer contact
    contactForms := textMap.put(contactForms, form.id, form);
  };

  // Staff access - both staff and admin can view all contact form submissions
  public query ({ caller }) func getAllContactForms() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can view contact forms");
    };
    var list = List.nil<ContactFormSubmission>();
    for ((_, form) in textMap.entries(contactForms)) {
      list := List.push(form, list);
    };
    List.toArray(list);
  };

  // Staff access - both staff and admin can mark contact form as handled
  public shared ({ caller }) func markContactFormHandled(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only staff members can mark contact forms as handled");
    };
    switch (textMap.get(contactForms, id)) {
      case (null) { Debug.trap("Contact form not found") };
      case (?form) {
        let updatedForm = { form with handled = true };
        contactForms := textMap.put(contactForms, id, updatedForm);
      };
    };
  };

  // Service pricing functions
  // Admin-only - only admins can update pricing
  public shared ({ caller }) func updateServicePricing(pricing : ServicePricing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update pricing");
    };
    servicePricing := textMap.put(servicePricing, "current", pricing);
  };

  // Public access - anyone can view pricing
  public query func getServicePricing() : async ?ServicePricing {
    // No authorization check - public access for viewing pricing
    textMap.get(servicePricing, "current");
  };

  // HTTP outcall transformation function
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Helper function for generating unique IDs
  func generateId() : Text {
    let timestamp = Time.now();
    let random = timestamp % 1000000;
    Text.concat("id-", Text.concat(debug_show (timestamp), debug_show (random)));
  };

  // New function to check if caller is staff (admin or user role)
  public query ({ caller }) func isCallerStaff() : async Bool {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#admin) { true };
      case (#user) { true };
      case (#guest) { false };
    };
  };
};
