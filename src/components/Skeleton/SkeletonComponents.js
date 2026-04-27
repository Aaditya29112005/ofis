import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonBase from './SkeletonBase';

export const SkeletonAvatar = ({ size = 40, style }) => (
  <SkeletonBase 
    width={size} 
    height={size} 
    circle 
    style={style} 
  />
);

export const SkeletonText = ({ lines = 1, width = '100%', height = 12, style, spacing = 8 }) => (
  <View style={style}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase
        key={i}
        width={i === lines - 1 && lines > 1 ? '60%' : width}
        height={height}
        borderRadius={4}
        style={{ marginBottom: i === lines - 1 ? 0 : spacing }}
      />
    ))}
  </View>
);

export const SkeletonBox = ({ width = '100%', height = 100, borderRadius = 12, style }) => (
  <SkeletonBase 
    width={width} 
    height={height} 
    borderRadius={borderRadius} 
    style={style} 
  />
);
