import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedProps,
  withTiming, 
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  FadeInDown,
  FadeInRight,
  Layout,
  interpolateColor,
  interpolate
} from 'react-native-reanimated';
import { Menu } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import Skeleton from '../components/Skeleton';
import { useTheme } from '../context/ThemeContext';
import { formatLiveDate } from '../utils/dateUtils';
import Haptics from '../utils/Haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Animated Number Counter ────────────────────────────────────
const AnimatedNumber = ({ value, prefix = '₹', style }) => {
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 60;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.floor(eased * value));
      if (frame >= totalFrames) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, 1500 / totalFrames);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{display.toLocaleString('en-IN')}
    </Text>
  );
};

const TouchableScale = ({ children, onPress, style, activeScale = 0.96 }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => { scale.value = withSpring(activeScale, { damping: 15, stiffness: 200 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}
      onPress={() => {
        Haptics.impactLight();
        onPress?.();
      }}
      style={style}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Sparkline (Minimal Trend) ──────────────────────────────────
const MiniSparkline = ({ data, color, delay }) => {
  return (
    <View style={styles.sparklineContainer}>
      {data.map((val, i) => {
        const height = useSharedValue(0);
        useEffect(() => {
          height.value = withDelay(delay + (i * 40), withSpring(val, { damping: 12, stiffness: 80 }));
        }, [val]);
        const style = useAnimatedStyle(() => ({ height: height.value }));
        
        return (
          <Animated.View 
            key={i} 
            style={[
              styles.sparklineBar, 
              { backgroundColor: i === data.length - 1 ? color : color + '40' },
              style
            ]} 
          />
        );
      })}
    </View>
  );
};

// ─── Animated Bar Graph (Hero Section Revival) ──────────────────
const AnimatedBar = ({ height, maxHeight, label, isHighlighted, delay }) => {
  const { colors, isDark } = useTheme();
  const [barH, setBarH] = React.useState(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBarH(height);
    }, delay);
    if (isHighlighted) {
      glowOpacity.value = withDelay(delay + 600, withTiming(1, { duration: 600 }));
    }
    return () => clearTimeout(timeout);
  }, [height, delay, isHighlighted]);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const barColor = isHighlighted
    ? (isDark ? '#FF8A00' : '#EA580C')
    : (isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0');

  return (
    <View style={styles.barContainer}>
      <View style={styles.barInner}>
        {isHighlighted && <Animated.View style={[styles.barGlow, glowStyle]} />}
        <View
          style={[
            styles.mainBar,
            { backgroundColor: barColor, height: barH, transition: 'height' }
          ]}
        />
      </View>
      <Text
        style={[styles.graphLabel, {
          color: isHighlighted ? (isDark ? '#FF8A00' : '#EA580C') : colors.textSecondary,
          fontFamily: isHighlighted ? FONTS.bold : FONTS.medium
        }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {label}
      </Text>
    </View>
  );
};

// ─── Quick Action Card ──────────────────────────────────────────
const QuickActionCard = ({ icon, label, color, delay, onPress, hasIndicator, isProminent }) => {
  const { isDark, colors } = useTheme();

  const indicatorPulse = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const cardGlow = useSharedValue(0.4);

  useEffect(() => {
    if (hasIndicator) {
      indicatorPulse.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
    
    if (isProminent) {
      cardScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      cardGlow.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [hasIndicator, isProminent]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: indicatorPulse.value }));
  const prominentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    shadowOpacity: cardGlow.value,
  }));

  return (
    <Animated.View 
      entering={FadeInDown.duration(800).delay(delay).springify().damping(15)} 
      style={{ marginRight: 12 }}
    >
      <TouchableScale activeScale={0.94} onPress={onPress}>
        <Animated.View style={[
          styles.quickActionCard, 
          {
            backgroundColor: isDark ? colors.surfaceElevated : '#FFFFFF',
            borderColor: isProminent 
              ? (isDark ? `${COLORS.primary}60` : `${COLORS.primary}40`) 
              : colors.border,
            borderWidth: isProminent ? 1.5 : 1,
            shadowColor: isProminent ? COLORS.primary : (isDark ? '#000' : '#475569'),
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowOffset: { width: 0, height: isProminent ? 8 : 6 },
            shadowRadius: isProminent ? 12 : 8,
            width: isProminent ? 120 : 108,
          },
          isProminent && prominentStyle
        ]}>
          {hasIndicator && (
             <Animated.View style={[
               {
                 position: 'absolute', top: 10, right: 10, width: 10, height: 10, borderRadius: 5,
                 backgroundColor: '#34C759', borderWidth: 1.5, borderColor: isDark ? '#000' : '#FFF',
                 shadowColor: '#34C759', shadowOpacity: 0.8, shadowRadius: 4, shadowOffset: { width: 0, height: 0 },
               },
               pulseStyle
             ]} />
          )}
          <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
            <Icon name={icon} size={22} color={color} />
          </View>
          <Text style={[
            styles.quickActionLabel, 
            { 
              color: colors.text,
              fontFamily: isProminent ? FONTS.bold : FONTS.medium,
              fontSize: isProminent ? 12 : 11
            }
          ]} numberOfLines={1}>{label}</Text>
        </Animated.View>
      </TouchableScale>
    </Animated.View>
  );
};

// ─── Task Item ──────────────────────────────────────────────────
const TaskItem = ({ title, time, completed }) => {
  const { colors } = useTheme();
  return (
    <TouchableScale>
      <View style={styles.taskItem}>
        <View style={[styles.checkbox, { backgroundColor: completed ? '#34C759' : colors.card, borderColor: completed ? '#34C759' : colors.border }]}>
          {completed && <Icon name="checkmark" size={12} color="#FFF" />}
        </View>
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, { color: completed ? colors.textMuted : colors.text, textDecorationLine: completed ? 'line-through' : 'none' }]}>
            {title}
          </Text>
          <Text style={[styles.taskTime, { color: colors.textSecondary }]}>{time}</Text>
        </View>
      </View>
    </TouchableScale>
  );
};

// ─── Activity Row ───────────────────────────────────────────────
const ActivityRow = ({ action, description, timeStamp, iconName, color }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.activityRow}>
      <View style={[styles.activityIconBox, { backgroundColor: color + '15' }]}>
        <Icon name={iconName} size={16} color={color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityAction, { color: colors.text }]}>{action}</Text>
        <Text style={[styles.activityDesc, { color: colors.textSecondary }]} numberOfLines={1}>{description}</Text>
      </View>
      <Text style={[styles.activityTime, { color: colors.textMuted }]}>{timeStamp}</Text>
    </View>
  );
};

// ─── Stat Card Small ────────────────────────────────────────────
const StatCardSmall = ({ title, value, iconName, color, trend, delay }) => {
  const { colors, isDark } = useTheme();
  const bounce = useSharedValue(20);

  useEffect(() => {
    bounce.value = withDelay(delay + 200, withSpring(0, { damping: 10, stiffness: 100 }));
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
    opacity: interpolate(bounce.value, [20, 0], [0, 1])
  }));

  return (
    <TouchableScale style={{ width: '48%' }}>
      <GlassCard style={styles.smallStatCard}>
        <View style={styles.smallStatHeader}>
          <View style={styles.iconGlowBox}>
            <View style={[styles.iconUnderglow, { backgroundColor: color, shadowColor: color }]} />
            <Animated.View style={bounceStyle}>
              <Icon name={iconName} size={18} color={color} />
            </Animated.View>
          </View>
          <Text style={[styles.trendText, { color: trend.includes('+') ? '#34C759' : '#FF453A' }]}>{trend}</Text>
        </View>
        <Text style={[styles.smallStatValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.smallStatTitle, { color: colors.textSecondary }]}>{title}</Text>
      </GlassCard>
    </TouchableScale>
  );
};

// ─── AI Insight Card ─────────────────────────────────────────────
const AIInsightCard = ({ delay }) => {
  const { isDark, colors } = useTheme();
  
  // Shimmer effect using opacity + scale
  const shimmer = useSharedValue(0.3);
  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withDelay(2000, withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);
  
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(delay)} style={styles.insightWrapper}>
      <TouchableScale activeScale={0.98}>
        <View style={[styles.aiCard, { 
          backgroundColor: isDark ? `${COLORS.primary}12` : `${COLORS.primary}08`,
          borderColor: isDark ? `${COLORS.primary}30` : `${COLORS.primary}20`
        }]}>
          <Animated.View style={[styles.aiGlow, shimmerStyle, { backgroundColor: COLORS.primary }]} />
          
          <View style={styles.aiIconBox}>
            <Icon name="color-wand" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.aiContent}>
            <Text style={[styles.aiText, { color: colors.text }]}>
              Net Revenue has increased <Text style={{ color: COLORS.primary, fontFamily: FONTS.bold }}>18%</Text> this month.
            </Text>
          </View>
          <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
        </View>
      </TouchableScale>
    </Animated.View>
  );
};

// ─── Smart Suggestion Card ──────────────────────────────────────
const SmartSuggestionCard = ({ title, priority, color, delay }) => {
  const { isDark, colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(delay)} style={{ marginRight: 12 }}>
      <TouchableScale activeScale={0.94}>
        <View style={[styles.suggestionCard, {
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
          shadowColor: isDark ? '#000' : '#475569',
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowOffset: { width: 0, height: 4 },
        }]}>
          <View style={styles.suggestionTop}>
            <View style={[styles.priorityPill, { backgroundColor: color + '15' }]}>
              <Text style={[styles.priorityText, { color: color }]}>{priority}</Text>
            </View>
            <Icon name="arrow-forward" size={14} color={colors.textMuted} />
          </View>
          <Text style={[styles.suggestionTitle, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </TouchableScale>
    </Animated.View>
  );
};

// ─── Main Dashboard Screen ──────────────────────────────────────
const DashboardScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const revenueData = [
    { label: 'Jan', value: 35 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 40 },
    { label: 'Apr', value: 65 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: 80 },
    { label: 'Jul', value: 60 },
    { label: 'Aug', value: 110 },
    { label: 'Sep', value: 90 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const suggestions = [
    { title: 'Follow up with 4 inactive clients', priority: 'HIGH', color: COLORS.error },
    { title: 'Review 14 pending invoices', priority: 'MED', color: COLORS.primary },
    { title: 'Optimize peak booking hours', priority: 'LOW', color: '#5AC8FA' },
    { title: 'Check support ticket backlog', priority: 'MED', color: COLORS.primary },
  ];

  const quickActions = [
    { icon: 'notifications', label: 'Reception', color: COLORS.primary, hasIndicator: true, isProminent: true },
    { icon: 'person-add-outline', label: 'Add Client', color: '#5AC8FA' },
    { icon: 'ticket-outline', label: 'New Ticket', color: '#AF52DE' },
    { icon: 'receipt-outline', label: 'Invoicing', color: '#34C759' },
    { icon: 'calendar-outline', label: 'Book Room', color: '#FF453A' },
  ];

  const headerFloat = useSharedValue(0);
  const dotPulse = useSharedValue(0.3);
  const ambientGlow = useSharedValue(0.1);

  useEffect(() => {
    headerFloat.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
    dotPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
    ambientGlow.value = withRepeat(
      withSequence(
        withTiming(isDark ? 0.25 : 0.15, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.1, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
  }, [isDark]);

  const headerFloatingStyle = useAnimatedStyle(() => ({ transform: [{ translateY: headerFloat.value }] }));
  const dotAnimatedStyle = useAnimatedStyle(() => ({ opacity: dotPulse.value }));
  const bgGlowStyle = useAnimatedStyle(() => ({ opacity: ambientGlow.value }));

  const handleNavigation = useCallback((screen) => {
    if (screen === 'Reception') navigation.navigate('Reception');
    else if (screen === 'Add Client') navigation.navigate('Clients');
    else if (screen === 'New Ticket') navigation.navigate('CreateTicket');
    else if (screen === 'Invoicing') navigation.navigate('Billing');
    else if (screen === 'Book Room') navigation.navigate('MeetingRoomBookings');
    else if (screen === 'Reports') navigation.navigate('Reports');
  }, [navigation]);

  return (
    <DashboardLayout activeTab="Dashboard">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
        style={styles.container}
      >
        {/* ── Header Ambient Glow ──────────────────────── */}
        <Animated.View style={[styles.headerAmbientGlow, bgGlowStyle, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />

        {/* ── Header Section ─────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.topSection}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactLight();
                navigation.openDrawer();
              }}
              style={styles.menuBtn}
            >
              <Menu size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[styles.pageTitle, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">Executive Insight</Text>
              <Animated.Text 
                style={[styles.pageSubtitle, { color: colors.textSecondary }, headerFloatingStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatLiveDate()}  •  Ofis Square
              </Animated.Text>
            </View>
          </View>
          <TouchableScale activeScale={0.88}>
            <View style={[styles.avatarBorder, { borderColor: colors.border }]}>
              <View style={styles.avatarCore}>
                <Text style={styles.avatarText}>N</Text>
              </View>
              <Animated.View style={[styles.avatarOnlineDot, dotAnimatedStyle]} />
            </View>
          </TouchableScale>
        </Animated.View>

        {/* ── AI Insights Card ────────────────────────────── */}
        <AIInsightCard delay={100} />

        {/* ── Smart Suggestions ───────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.sectionBlock}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>SMART SUGGESTIONS</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
            snapToInterval={172} // 160px width + 12px margin
            decelerationRate="fast"
          >
            {suggestions.map((item, i) => (
              <SmartSuggestionCard
                key={i}
                title={item.title}
                priority={item.priority}
                color={item.color}
                delay={250 + (i * 80)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Quick Actions ───────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(600).delay(350)} style={styles.sectionBlock}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>QUICK ACTIONS</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
            snapToInterval={112} // 100px width + 12px margin
            decelerationRate="fast"
          >
            {quickActions.map((action, i) => (
              <QuickActionCard
                key={action.label}
                icon={action.icon}
                label={action.label}
                color={action.color}
                hasIndicator={action.hasIndicator}
                isProminent={action.isProminent}
                delay={350 + (i * 80)}
                onPress={() => handleNavigation(action.label)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {isLoading ? (
          <View>
            <Skeleton width="100%" height={160} borderRadius={24} style={{ marginBottom: 20 }} />
            <View style={styles.gridRow}>
              <Skeleton width="48%" height={140} borderRadius={20} />
              <Skeleton width="48%" height={140} borderRadius={20} />
            </View>
            <Skeleton width="100%" height={240} borderRadius={24} style={{ marginTop: 20 }} />
          </View>
        ) : (
          <React.Fragment>
            {/* ── Revenue Summary (Hero Revival) ────────────── */}
            <Animated.View entering={FadeInDown.duration(600).delay(500)} layout={Layout.springify()}>
              <TouchableScale activeScale={0.99}>
                <GlassCard style={styles.heroRevenueCard}>
                  <View style={styles.movingGradientOverlay} />
                  <View style={styles.revenueTopRow}>
                    <View>
                      <Text style={[styles.labelMuted, { color: colors.textSecondary }]}>NET REVENUE</Text>
                      <AnimatedNumber value={1428500} style={[styles.heroDigit, { color: colors.text }]} />
                    </View>
                    <Animated.View entering={FadeInRight.duration(600).delay(900)}>
                      <View style={styles.growthBadge}>
                        <Icon name="arrow-up" size={12} color="#34C759" />
                        <Text style={styles.growthText}>+18.4%</Text>
                      </View>
                    </Animated.View>
                  </View>

                  <View style={styles.revenueGraph}>
                    {revenueData.map((item, i) => (
                      <AnimatedBar 
                        key={item.label}
                        height={Math.round((item.value / 110) * 90)}
                        maxHeight={90}
                        label={item.label}
                        isHighlighted={item.label === 'Aug'}
                        delay={600 + (i * 50)}
                      />
                    ))}
                  </View>
                </GlassCard>
              </TouchableScale>
            </Animated.View>

            {/* ── Quick Stats Grid ─────────────────────────── */}
            <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.gridRow}>
              <StatCardSmall title="Active Clients" value="234" iconName="people" color="#5AC8FA" trend="+12" delay={600} />
              <StatCardSmall title="Open Tickets" value="14" iconName="flash" color="#FF453A" trend="-2" delay={650} />
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.gridRow}>
              <StatCardSmall title="Invoices Due" value="₹45K" iconName="receipt" color="#FF8A00" trend="+₹5K" delay={700} />
              <StatCardSmall title="Occupancy" value="92%" iconName="business" color="#34C759" trend="+4%" delay={750} />
            </Animated.View>

            {/* ── Today's Tasks ────────────────────────────── */}
            <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginBottom: 0 }]}>TODAY'S TASKS</Text>
                <TouchableOpacity onPress={() => Haptics.impactLight()}>
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                </TouchableOpacity>
              </View>
              <GlassCard style={styles.listCard}>
                <TaskItem title="Approve pending invoices" time="10:00 AM" completed={false} />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <TaskItem title="Client onboarding meeting" time="2:30 PM" completed={false} />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <TaskItem title="Verify AMC renewals" time="Yesterday" completed={true} />
              </GlassCard>
            </Animated.View>

            {/* ── Recent Activity ──────────────────────────── */}
            <Animated.View entering={FadeInDown.duration(600).delay(900)} style={styles.sectionBlock}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>RECENT ACTIVITY</Text>
              <GlassCard style={styles.listCard}>
                <ActivityRow action="Payment Received" description="₹45,200 from TechCorp Inc." timeStamp="2m ago" iconName="checkmark-circle" color="#34C759" />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <ActivityRow action="New Ticket" description="AC Cooling issue in Cabin 12" timeStamp="1h ago" iconName="warning" color="#FF453A" />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <ActivityRow action="Room Booked" description="Conference Room A" timeStamp="3h ago" iconName="calendar" color="#AF52DE" />
              </GlassCard>
            </Animated.View>
          </React.Fragment>
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </DashboardLayout>
  );
};

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 140,
  },

  // ── Header ────────────────────────
  headerAmbientGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 150,
    borderRadius: 75,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontFamily: FONTS.bold, fontSize: 15 },
  avatarOnlineDot: {
    position: 'absolute', bottom: 1, right: 1, width: 10, height: 10,
    borderRadius: 5, backgroundColor: '#34C759', borderWidth: 2, borderColor: '#000000',
  },

  // ── AI Insights ───────────────────
  insightWrapper: {
    marginBottom: 28,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  aiGlow: {
    ...StyleSheet.absoluteFillObject,
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -20,
    left: -20,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  aiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 138, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiContent: {
    flex: 1,
  },
  aiText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    lineHeight: 18,
  },

  // ── Smart Suggestions ─────────────
  suggestionsScroll: {
    paddingRight: 16,
    paddingBottom: 10,
  },
  suggestionCard: {
    width: 160,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    height: 98,
    justifyContent: 'space-between',
  },
  suggestionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  suggestionTitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    lineHeight: 18,
  },

  // ── Section ───────────────────────
  sectionBlock: { marginBottom: 28 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginLeft: 2,
    marginRight: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginLeft: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },

  // ── Quick Actions ─────────────────
  quickActionsScroll: { paddingRight: 16, paddingBottom: 10 },
  quickActionCard: {
    width: 100,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: { fontSize: 11, fontFamily: FONTS.medium, textAlign: 'center' },

  // ── Revenue Card ──────────────────
  heroRevenueCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  movingGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
    zIndex: 0,
  },
  revenueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    zIndex: 1,
  },
  labelMuted: { fontSize: 11, fontFamily: FONTS.bold, letterSpacing: 1.2, textTransform: 'uppercase' },
  heroDigit: { fontSize: 36, fontFamily: FONTS.bold, marginTop: 4, letterSpacing: -1 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  growthBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  growthText: { color: '#34C759', fontSize: 12, fontFamily: FONTS.bold },

  revenueGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 2,
    zIndex: 1,
  },
  barContainer: { alignItems: 'center', width: '9%', alignSelf: 'stretch' },
  barInner: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, width: '100%' },
  mainBar: { width: 12, borderRadius: 6, marginBottom: 6 },
  barGlow: { position: 'absolute', bottom: 6, width: 12, height: '100%', borderRadius: 6, backgroundColor: '#FF8A00', opacity: 0.3 },
  graphLabel: { fontSize: 9, fontFamily: FONTS.medium, textAlign: 'center', marginTop: 4 },

  // ── Stats Grid ────────────────────
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  smallStatCard: { padding: 16, borderRadius: 20, marginBottom: 0 },
  smallStatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconGlowBox: { position: 'relative' },
  iconUnderglow: { position: 'absolute', top: 2, left: 2, width: '100%', height: '100%', borderRadius: 10, shadowColor: '#FF8A00', shadowOpacity: 0.3, shadowRadius: 6, opacity: 0.4 },
  trendText: { fontSize: 11, fontFamily: FONTS.bold },
  smallStatValue: { fontSize: 22, fontFamily: FONTS.bold, letterSpacing: -0.5, marginBottom: 2 },
  smallStatTitle: { fontSize: 12, fontFamily: FONTS.medium },

  // ── List Widgets ──────────────────
  listCard: { padding: 16, borderRadius: 20, marginBottom: 0 },
  divider: { height: 1, width: '100%', marginVertical: 12, opacity: 0.6 },
  
  // Task Items
  taskItem: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  taskContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskTitle: { fontSize: 14, fontFamily: FONTS.medium, flex: 1, marginRight: 10 },
  taskTime: { fontSize: 12, fontFamily: FONTS.medium },

  // Activity Rows
  activityRow: { flexDirection: 'row', alignItems: 'flex-start' },
  activityIconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activityContent: { flex: 1, justifyContent: 'center' },
  activityAction: { fontSize: 14, fontFamily: FONTS.bold, marginBottom: 2 },
  activityDesc: { fontSize: 13, fontFamily: FONTS.medium },
  activityTime: { fontSize: 11, fontFamily: FONTS.medium, marginTop: 2 },

});

export default DashboardScreen;
