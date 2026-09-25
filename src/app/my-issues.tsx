import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api } from "../services/api";

type Issue = {
  id: string | number;
  reported_by?: string;
  name: string;
  description?: string;
  category?: string;
  photo_evidence?: string[];
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    captured_at: string;
  };
  status?: string;
  support_count?: number;
  assigned_to?: string | number | null;
  resolution_note?: string | null;
  resolution_photo_evidence?: string[];
};

export default function MyIssuesScreen() {
  const router = useRouter();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchIssues = async () => {
    try {
      setError("");

      const response = await api.get("/api/issues");

      console.log("Issues API response:", response.data);

      // API should return an array
      if (Array.isArray(response.data)) {
        setIssues(response.data);
      } else {
        setIssues([]);
        setError("Invalid response received from server.");
      }
    } catch (err: any) {
      console.log("Fetch issues error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message === "Network Error") {
        setError(
          "Cannot connect to server. Check that the backend is running."
        );
      } else {
        setError("Unable to load issues. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIssues();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const getStatusStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
      case "completed":
        return styles.statusResolved;

      case "in progress":
      case "assigned":
        return styles.statusProgress;

      case "rejected":
        return styles.statusRejected;

      default:
        return styles.statusPending;
    }
  };

  const renderIssue = ({ item }: { item: Issue }) => {
    const photoCount = Array.isArray(item.photo_evidence)
      ? item.photo_evidence.length
      : 0;

    return (
      <TouchableOpacity
        style={styles.issueCard}
        activeOpacity={0.8}
        onPress={() => {
          router.push({
            pathname: "/issue-details",
            params: {
              issue: JSON.stringify(item),
            },
          });
        }}
      >
        <View style={styles.cardTop}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryIcon}>📍</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.issueName} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.category}>
                {item.category || "Other"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              getStatusStyle(item.status),
            ]}
          >
            <Text style={styles.statusText}>
              {item.status || "Pending"}
            </Text>
          </View>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.cardBottom}>
          <Text style={styles.infoText}>
            📷 {photoCount} photo{photoCount !== 1 ? "s" : ""}
          </Text>

          <Text style={styles.infoText}>
            👍 {item.support_count || 0}
          </Text>

          <Text style={styles.viewText}>View →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>
            Loading your issues...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Issues</Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchIssues}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Empty state */}
      {!error && issues.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>

          <Text style={styles.emptyTitle}>
            No Issues Reported
          </Text>

          <Text style={styles.emptyDescription}>
            You haven't reported any civic issues yet.
          </Text>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => router.push("/report")}
          >
            <Text style={styles.reportButtonText}>
              Report an Issue
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item, index) =>
            String(item.id ?? index)
          }
          renderItem={renderIssue}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.countText}>
                {issues.length} issue
                {issues.length !== 1 ? "s" : ""}
              </Text>

              <Text style={styles.swipeText}>
                Pull down to refresh
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    height: 64,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 38,
    color: "#111827",
    lineHeight: 42,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748B",
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  countText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  swipeText: {
    fontSize: 12,
    color: "#94A3B8",
  },

  issueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  categoryContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: 10,
  },

  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },

  issueName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  category: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusPending: {
    backgroundColor: "#FEF3C7",
  },

  statusProgress: {
    backgroundColor: "#DBEAFE",
  },

  statusResolved: {
    backgroundColor: "#DCFCE7",
  },

  statusRejected: {
    backgroundColor: "#FEE2E2",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
    marginTop: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    fontSize: 12,
    color: "#64748B",
    marginRight: 16,
  },

  viewText: {
    marginLeft: "auto",
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  emptyDescription: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  reportButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },

  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    lineHeight: 20,
  },

  retryButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});