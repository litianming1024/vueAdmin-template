<template>
  <div class="app-container calendar-list-container">
    <data-tables :data="tabledata" :actions-def="actionsDef" :checkbox-filter-def="checkFilterDef"
                 :action-col-def="actionColDef">
      <el-table-column v-for="title in titles" :key="title" :prop="title.prop" :label="title.label" sortable="custom">
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
  export default {
    name: 'permission',
    data() {
      return {
        tabledata: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        titles: [{
          prop: 'name',
          label: 'name'
        }],
        actionsDef: {
          colProps: {
            span: 5
          },
          def: [{
            name: 'new',
            handler: () => {
              this.data.push({
                'content': 'hello world',
                'flow_no': 'FW201601010004',
                'flow_type': 'Help',
                'flow_type_code': 'help'
              })
            },
            buttonProps: {
              type: 'text'
            }
          }, {
            name: 'import',
            handler: () => {
              this.$message('import clicked')
            },
            icon: 'upload'
          }]
        },
        checkFilterDef: {
          props: 'flow_type_code',
          def: [{
            'code': 'repair',
            'name': 'Repair'
          }, {
            'code': 'help',
            'name': 'Help'
          }]
        },
        actionColDef: {
          label: 'Actions',
          def: [{
            handler: row => {
              this.$message('Edit clicked')
              row.flow_no = 'hello word'
            },
            name: 'Edit'
          }, {
            icon: 'message',
            type: 'text',
            handler: row => {
              this.$message('RUA in row clicked')
              console.log('RUA in row clicked', row)
            },
            name: 'RUA'
          }]
        }
      }
    },
    methods: {
      getRowActionsDef() {
        const self = this
        return [{
          type: 'primary',
          handler(row) {
            self.$message('Edit clicked')
            console.log('Edit in row clicked', row)
          },
          name: 'Edit'
        }]
      }
    }
  }
</script>
