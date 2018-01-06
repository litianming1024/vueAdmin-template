<template>
  <div class="app-container calendar-list-container">
    <data-tables-server :total="total" :actions-def="actionsDef" :checkbox-filter-def="checkFilterDef"
                 :action-col-def="actionColDef" :load-data="loadData">
      <el-table-column v-for="title in titles" :key="title" :prop="title.prop" :label="title.label" sortable="custom">
      </el-table-column>
    </data-tables-server>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form :rules="rules" ref="dataForm" :model="temp" label-width="100px">
        <!--label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'-->
        <el-form-item label="中文名">
          <el-input v-model="temp.cname" placeholder="中文名" :disabled="dialogFormEdit"></el-input>
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="temp.ename" placeholder="英文名" :disabled="dialogFormEdit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as permissionApi from '@/api/system/permission'

  export default {
    name: 'permission',
    data() {
      return {
        tabledata: [],
        total: 0,
        titles: [{
          prop: 'cname',
          label: '中文名'
        }, {
          prop: 'ename',
          label: '英文名'
        }],
        downloadLoading: false,
        dialogFormVisible: false,
        dialogFormEdit: Boolean, // 默认表单可以编辑
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加',
          info: '详情'
        },
        temp: {
          cname: '',
          ename: ''
        },
        rules: {},
        actionsDef: {
          colProps: {
            span: 8
          },
          def: [{
            name: '添加',
            icon: 'el-icon-plus',
            handler: () => {
              this.handleCreate()
              this.$message('add clicked')
            }
          }, {
            name: '导入',
            icon: 'el-icon-upload',
            handler: () => {
              this.$message('import clicked')
            }
          }, {
            name: '导出',
            icon: 'el-icon-download',
            handler: () => {
              this.handleDownload()
            }
          }]
        },
        checkFilterDef: {
          colProps: {
            span: 8
          },
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
          label: '操作',
          tableColProps: {
            align: 'center'
          },
          def: [{
            name: '详情',
            type: 'info',
            handler: row => {
              this.handleInfo(row)
            }
          }, {
            name: '编辑',
            type: 'primary',
            handler: row => {
              this.handleUpdate(row)
            }
          }, {
            name: '删除',
            type: 'danger',
            handler: row => {
              this.$message('delete clicked')
              console.log('RUA in row clicked', row)
            }
          }]
        }
      }
    },
    created() {
    },
    methods: {
      loadData(queryInfo) {
        return permissionApi.fetchList(queryInfo).then(response => {
          console.log(response)
          this.tableData = response.data
          this.total = response.total
        })
      },
      resetTemp() {
        this.temp = {
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.dialogFormEditChange(false)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            permissionApi.create(this.temp).then(() => {
              // this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success'
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogFormEditChange(false)
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            permissionApi.update(tempData).then(() => {
              for (const v of this.tabledata) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success'
              })
            })
          }
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel(tHeader, data, 'table-list')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            // return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handleInfo(row) {
        this.dialogFormEditChange(true)
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'info'
        this.dialogFormVisible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
      },
      dialogFormEditChange(flag) {
        this.dialogFormEdit = flag
      }
    }
  }
</script>
