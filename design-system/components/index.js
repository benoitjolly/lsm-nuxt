/**
 * Design System Components
 * Composants réutilisables basés sur les tokens sémantiques
 */

export { default as Button } from './Button.vue'
export { default as Input } from './Input.vue'
export { default as AuthLink } from './AuthLink.vue'
export { default as Separator } from './Separator.vue'
export { default as Card } from './Card.vue'
export { default as CardContent } from './CardContent.vue'
export { default as Heading } from './Heading.vue'
export { default as DescriptionList } from './DescriptionList.vue'
export { default as DescriptionListItem } from './DescriptionListItem.vue'
export { default as Table } from './Table.vue'
export { default as SearchInput } from './SearchInput.vue'
export { default as Badge } from './Badge.vue'
export { default as Avatar } from './Avatar.vue'
export { default as Modal } from './Modal.vue'
export { default as Alert } from './Alert.vue'
export { default as Tabs } from './Tabs.vue'
export { default as CartAnimation } from './CartAnimation.vue'
export { default as Tooltip } from './Tooltip.vue'

// Export par défaut pour faciliter l'import
export default {
  Button: () => import('./Button.vue'),
  Input: () => import('./Input.vue'),
  AuthLink: () => import('./AuthLink.vue'),
  Separator: () => import('./Separator.vue'),
  Card: () => import('./Card.vue'),
  CardContent: () => import('./CardContent.vue'),
  Heading: () => import('./Heading.vue'),
  DescriptionList: () => import('./DescriptionList.vue'),
  DescriptionListItem: () => import('./DescriptionListItem.vue'),
  Table: () => import('./Table.vue'),
  SearchInput: () => import('./SearchInput.vue'),
  Badge: () => import('./Badge.vue'),
  Avatar: () => import('./Avatar.vue'),
  Modal: () => import('./Modal.vue'),
  Alert: () => import('./Alert.vue'),
  Tabs: () => import('./Tabs.vue'),
  CartAnimation: () => import('./CartAnimation.vue'),
  Tooltip: () => import('./Tooltip.vue'),
} 