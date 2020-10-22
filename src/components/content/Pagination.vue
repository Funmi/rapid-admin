<template>
  <el-pagination
    background
    :hide-on-single-page="hideOnSinglePage"
    layout="sizes, total, prev, pager, next"
    :total="status.total"
    :page-size="status.pageSize"
    :page-sizes="pageSizes"
    :current-page="status.page"
    @current-change="pageChange"
    @size-change="sizeChange"
  ></el-pagination>
</template>

<script>
export default {
  name: "pagination",
  props: {
    hideOnSinglePage: {
      type: Boolean,
      default: true
    },
    status: Object,
    pageSizes: {
      type: Array,
      default: function() {
        return [5, 10, 15, 20, 30, 50]
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    pageChange(page) {
      this.$emit("page_change", page);
    },
    sizeChange(size) {
      this.$emit("size_change", size);
    },
  }
};
</script>

<style scoped>
.el-pagination {
  width: 100%;
  text-align: center;
  background: white;
}
</style>