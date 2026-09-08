export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type Table<
  Row,
  Insert,
  Relationships extends Relationship[] = [],
  Update = Partial<Row>,
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export type RestaurantMemberRole = "owner" | "manager" | "staff";
export type RestaurantSeverity = "info" | "low" | "medium" | "high" | "critical";
export type RestaurantHandlingMode = "auto" | "approval" | "human";
export type RestaurantEventStatus =
  | "new"
  | "processing"
  | "waiting_approval"
  | "handled"
  | "escalated"
  | "dismissed"
  | "failed";
export type RestaurantAttentionStatus = "open" | "assigned" | "resolved" | "dismissed";
export type RestaurantApprovalStatus = "pending" | "approved" | "edited" | "rejected" | "expired";
export type RestaurantActorType = "nexus" | "user" | "system";

export type RestaurantOrganizationRow = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  default_currency: string;
  default_locale: string;
  created_at: string;
  updated_at: string;
};

export type RestaurantBranchRow = {
  id: string;
  organization_id: string;
  name: string;
  city: string | null;
  country: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RestaurantMemberRow = {
  id: string;
  organization_id: string;
  user_id: string;
  role: RestaurantMemberRole;
  created_at: string;
};

export type RestaurantEventRow = {
  id: string;
  organization_id: string;
  branch_id: string | null;
  created_at: string;
  occurred_at: string;
  source: string;
  event_type: string;
  category: string;
  title: string;
  summary: string;
  severity: RestaurantSeverity;
  handling_mode: RestaurantHandlingMode;
  status: RestaurantEventStatus;
  source_reference: string | null;
  subject_type: string | null;
  subject_id: string | null;
  structured_data: Json;
  confidence: number | null;
  requires_attention: boolean;
  dedupe_key: string | null;
  updated_at: string;
};

export type ManagerAttentionItemRow = {
  id: string;
  organization_id: string;
  branch_id: string | null;
  event_id: string | null;
  title: string;
  summary: string;
  priority: RestaurantSeverity;
  category: string;
  status: RestaurantAttentionStatus;
  assigned_to: string | null;
  due_at: string | null;
  created_at: string;
  resolved_at: string | null;
  updated_at: string;
};

export type ManagerApprovalRow = {
  id: string;
  organization_id: string;
  branch_id: string | null;
  event_id: string | null;
  action_type: string;
  title: string;
  summary: string;
  proposed_action: Json;
  status: RestaurantApprovalStatus;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewer_note: string | null;
  updated_at: string;
};

export type RestaurantActivityRow = {
  id: string;
  organization_id: string;
  branch_id: string | null;
  actor_type: RestaurantActorType;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  metadata: Json;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      restaurant_organizations: Table<
        RestaurantOrganizationRow,
        Pick<RestaurantOrganizationRow, "name" | "slug"> &
          Partial<Omit<RestaurantOrganizationRow, "name" | "slug">>
      >;
      restaurant_branches: Table<
        RestaurantBranchRow,
        Pick<RestaurantBranchRow, "organization_id" | "name" | "timezone"> &
          Partial<Omit<RestaurantBranchRow, "organization_id" | "name" | "timezone">>,
        [
          {
            foreignKeyName: "restaurant_branches_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_organizations";
            referencedColumns: ["id"];
          },
        ]
      >;
      restaurant_members: Table<
        RestaurantMemberRow,
        Pick<RestaurantMemberRow, "organization_id" | "user_id" | "role"> &
          Partial<Omit<RestaurantMemberRow, "organization_id" | "user_id" | "role">>,
        [
          {
            foreignKeyName: "restaurant_members_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_organizations";
            referencedColumns: ["id"];
          },
        ]
      >;
      restaurant_events: Table<
        RestaurantEventRow,
        Pick<
          RestaurantEventRow,
          | "organization_id"
          | "occurred_at"
          | "source"
          | "event_type"
          | "category"
          | "title"
          | "summary"
          | "handling_mode"
          | "status"
        > &
          Partial<
            Omit<
              RestaurantEventRow,
              | "organization_id"
              | "occurred_at"
              | "source"
              | "event_type"
              | "category"
              | "title"
              | "summary"
              | "handling_mode"
              | "status"
            >
          >,
        [
          {
            foreignKeyName: "restaurant_events_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "restaurant_events_branch_organization_fk";
            columns: ["branch_id", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_branches";
            referencedColumns: ["id", "organization_id"];
          },
        ]
      >;
      manager_attention_items: Table<
        ManagerAttentionItemRow,
        Pick<
          ManagerAttentionItemRow,
          "organization_id" | "title" | "summary" | "priority" | "category"
        > &
          Partial<
            Omit<
              ManagerAttentionItemRow,
              "organization_id" | "title" | "summary" | "priority" | "category"
            >
          >,
        [
          {
            foreignKeyName: "manager_attention_items_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "manager_attention_items_branch_organization_fk";
            columns: ["branch_id", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_branches";
            referencedColumns: ["id", "organization_id"];
          },
          {
            foreignKeyName: "manager_attention_items_event_organization_fk";
            columns: ["event_id", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_events";
            referencedColumns: ["id", "organization_id"];
          },
          {
            foreignKeyName: "manager_attention_items_assignee_organization_fk";
            columns: ["assigned_to", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_members";
            referencedColumns: ["user_id", "organization_id"];
          },
        ]
      >;
      manager_approvals: Table<
        ManagerApprovalRow,
        Pick<
          ManagerApprovalRow,
          "organization_id" | "action_type" | "title" | "summary"
        > &
          Partial<
            Omit<
              ManagerApprovalRow,
              "organization_id" | "action_type" | "title" | "summary"
            >
          >,
        [
          {
            foreignKeyName: "manager_approvals_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "manager_approvals_branch_organization_fk";
            columns: ["branch_id", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_branches";
            referencedColumns: ["id", "organization_id"];
          },
          {
            foreignKeyName: "manager_approvals_event_organization_fk";
            columns: ["event_id", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_events";
            referencedColumns: ["id", "organization_id"];
          },
          {
            foreignKeyName: "manager_approvals_reviewer_organization_fk";
            columns: ["reviewed_by", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_members";
            referencedColumns: ["user_id", "organization_id"];
          },
        ]
      >;
      restaurant_activity_log: Table<
        RestaurantActivityRow,
        Pick<
          RestaurantActivityRow,
          "organization_id" | "actor_type" | "action" | "entity_type" | "description"
        > &
          Partial<
            Omit<
              RestaurantActivityRow,
              "organization_id" | "actor_type" | "action" | "entity_type" | "description"
            >
          >,
        [
          {
            foreignKeyName: "restaurant_activity_log_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "restaurant_activity_log_branch_organization_fk";
            columns: ["branch_id", "organization_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_branches";
            referencedColumns: ["id", "organization_id"];
          },
        ]
      >;
    };
    Views: Record<never, never>;
    Functions: {
      ingest_restaurant_event: {
        Args: {
          p_actor_id: string;
          p_organization_id: string;
          p_branch_id: string | null;
          p_occurred_at: string;
          p_source: string;
          p_event_type: string;
          p_category: string;
          p_title: string;
          p_summary: string;
          p_severity: RestaurantSeverity;
          p_handling_mode: RestaurantHandlingMode;
          p_event_status: RestaurantEventStatus;
          p_source_reference: string | null;
          p_subject_type: string | null;
          p_subject_id: string | null;
          p_structured_data: Json;
          p_confidence: number | null;
          p_requires_attention: boolean;
          p_dedupe_key: string | null;
          p_attention_priority: RestaurantSeverity | null;
          p_approval_required: boolean;
          p_approval_action_type: string | null;
          p_proposed_action: Json;
        };
        Returns: Json;
      };
      update_manager_attention_item: {
        Args: {
          p_organization_id: string;
          p_attention_id: string;
          p_status: RestaurantAttentionStatus;
          p_assigned_to: string | null;
          p_assigned_to_is_set: boolean;
        };
        Returns: Json;
      };
      manage_restaurant_member: {
        Args: {
          p_organization_id: string;
          p_user_id: string;
          p_operation: "upsert" | "remove";
          p_role: RestaurantMemberRole | null;
        };
        Returns: Json;
      };
      process_manager_approval: {
        Args: {
          p_organization_id: string;
          p_approval_id: string;
          p_decision: "approved" | "edited" | "rejected";
          p_reviewer_note: string | null;
          p_edited_action: Json | null;
        };
        Returns: Json;
      };
      write_restaurant_activity: {
        Args: {
          p_actor_id: string;
          p_organization_id: string;
          p_branch_id: string | null;
          p_action: string;
          p_entity_type: string;
          p_entity_id: string | null;
          p_description: string;
          p_metadata: Json;
        };
        Returns: string;
      };
      assert_restaurant_branch: {
        Args: { p_organization_id: string; p_branch_id: string | null };
        Returns: undefined;
      };
      assert_restaurant_service_role: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      assert_restaurant_role: {
        Args: {
          p_organization_id: string;
          p_roles?: RestaurantMemberRole[] | null;
        };
        Returns: RestaurantMemberRole;
      };
      has_restaurant_role: {
        Args: { p_organization_id: string; p_roles: RestaurantMemberRole[] };
        Returns: boolean;
      };
      is_restaurant_member: {
        Args: { p_organization_id: string };
        Returns: boolean;
      };
      is_valid_restaurant_proposed_action: {
        Args: { p_action_type: string; p_action: Json };
        Returns: boolean;
      };
      is_valid_restaurant_structured_data: {
        Args: { p_data: Json };
        Returns: boolean;
      };
      is_valid_restaurant_timestamp: {
        Args: { p_value: string };
        Returns: boolean;
      };
    };
    Enums: {
      restaurant_member_role: RestaurantMemberRole;
      restaurant_severity: RestaurantSeverity;
      restaurant_handling_mode: RestaurantHandlingMode;
      restaurant_event_status: RestaurantEventStatus;
      restaurant_attention_status: RestaurantAttentionStatus;
      restaurant_approval_status: RestaurantApprovalStatus;
      restaurant_actor_type: RestaurantActorType;
    };
    CompositeTypes: Record<never, never>;
  };
};
