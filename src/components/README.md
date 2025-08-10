# 组件设计说明

## BookQuery 组件

### 组件概述
`BookQuery` 是一个可复用的查询组件，用于在 Firestore 数据库中搜索书籍。它支持按 ISBN 或书名进行搜索，并以列表形式显示结果。

### 为什么使用组件而不是页面

使用组件而不是页面有以下几个优势：

1. **复用性**：组件可以在多个页面中重复使用，而不需要复制代码。例如，`BookQuery` 组件在 `AddBookView` 和 `SearchBooksView` 页面中都被使用，还被封装在 `HomeBookSearch` 组件中用于首页。

2. **一致性**：通过在不同位置使用相同的组件，可以确保用户界面的一致性，提供统一的用户体验。

3. **维护性**：当需要修改功能时，只需要修改一个组件，而不是多个页面，减少了维护成本。

4. **灵活性**：组件可以接受 props 来自定义行为。例如，`BookQuery` 组件接受 `limit` 属性来限制结果数量，使其可以在不同场景下有不同的表现。

5. **封装性**：组件将相关的 HTML、CSS 和 JavaScript 代码封装在一起，使代码更加模块化和易于理解。

### 使用示例

#### 基本使用
```vue
<template>
  <BookQuery />
</template>

<script>
import BookQuery from '@/components/BookQuery.vue';

export default {
  components: {
    BookQuery
  }
};
</script>
```

#### 限制结果数量
```vue
<template>
  <BookQuery :limit="5" />
</template>
```

## HomeBookSearch 组件

`HomeBookSearch` 是一个封装了 `BookQuery` 的组件，专为首页设计，展示了如何通过组合现有组件创建新的功能组件。

### 组件组合的优势

1. **层次化设计**：可以通过组合简单组件创建复杂组件，形成组件树。

2. **关注点分离**：每个组件只关注自己的功能，使代码更加清晰。

3. **代码重用**：避免重复编写相似功能的代码。

## 总结

在 Vue.js 应用中，组件是构建用户界面的基本单位。通过合理设计和使用组件，可以提高代码的复用性、可维护性和可扩展性。在本项目中，我们通过创建 `BookQuery` 和 `HomeBookSearch` 组件，展示了组件化开发的优势和最佳实践。