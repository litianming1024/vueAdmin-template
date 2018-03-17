<template>
  <div class="app-container calendar-list-container">
    <data-tables-server :total="total" :actions-def="actionsDef" :checkbox-filter-def="checkFilterDef"
                        :action-col-def="actionColDef" :load-data="loadData"
                        :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item v-for="title in extraTitles" :key="title.id" :label="title.label">
              <span>{{ props.row[title.prop] }}</span>
            </el-form-item>
            <el-form-item v-for="title in titles" :key="title.id" :label="title.label">
              <span>{{ props.row[title.prop] }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-for="title in extraTitles" :key="title.id" :prop="title.prop" :label="title.label" sortable="custom">
      </el-table-column>
      <el-table-column v-for="title in titles" :key="title.id" :prop="title.prop" :label="title.label" sortable="custom">
      </el-table-column>
    </data-tables-server>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form v-if="dialogStatus!='delete'" :rules="rules" ref="dataForm" :model="temp" label-width="100px">
        <!--label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'-->
        <el-form-item v-for="title in titles" :key="title.prop" :label="title.label" :model="temp[title.prop]">
          <el-input v-model="temp[title.prop]" placeholder="" type="textarea" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">确认</el-button>
        <el-button v-if="dialogStatus=='delete'" type="danger" @click="deleteData">删除</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="previewDialogVisible" fullscreen center>
      <preview :data="temp">
      </preview>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as recruitmentApi from '@/api/resume/resume'
  import Preview from '@/components/resume/preview'

  export default {
    components: { Preview },
    name: 'resume',
    data() {
      return {
        tableData: [],
        total: 0,
        extraTitles: [{
          prop: 'id',
          label: '序号'
        }],
        titles: [{
          prop: 'name',
          label: '职位名称'
        }, {
          prop: 'workplace',
          label: '工作地点'
        }, {
          prop: 'category',
          label: '职位类别'
        }, {
          prop: 'responsibility',
          label: '工作职责'
        }, {
          prop: 'requirement',
          label: '工作要求'
        }, {
          prop: 'type',
          label: '招聘渠道'
        }],
        temp: {
          name: '',
          workplace: '',
          category: '',
          responsibility: '',
          requirement: '',
          type: ''
        },
        previewDialogVisible: false,
        downloadLoading: false,
        dialogFormVisible: false,
        dialogStatus: '',
        multipleSelection: [],
        textMap: {
          update: '编辑',
          create: '添加',
          delete: '删除'
        },
        rules: {},
        actionsDef: {
          colProps: {
            span: 12
          },
          def: [{
            name: '添加',
            icon: 'el-icon-plus',
            handler: () => {
              this.handleCreate()
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
          }, {
            name: '批量删除',
            icon: 'el-icon-warning',
            type: 'danger',
            handler: () => {
              this.handleDeleteSelection()
            }
          }]
        },
        checkFilterDef: {
          colProps: {
            span: 4
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
          fixed: 'right',
          tableColProps: {
            align: 'center'
          },
          colProps: {
            span: 12
          },
          def: [{
            name: '预览',
            type: 'primary',
            handler: row => {
              this.handlePreview(row)
            }
          }, {
            name: '删除',
            type: 'danger',
            handler: row => {
              this.handleDelete(row)
            }
          }]
        }
      }
    },
    created() {
    },
    methods: {
      loadData(queryInfo) {
        return recruitmentApi.fetchList(queryInfo).then(response => {
          this.tableData = response.data.content
          this.total = response.data.totalElements
        })
      },
      resetTemp() {
        this.temp = {
          id: Number
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            recruitmentApi.createData(this.temp).then((response) => {
              this.tableData.unshift(response.data)
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
            recruitmentApi.updateData(tempData.id, tempData).then(() => {
              for (const v of this.tableData) {
                if (v.id === this.temp.id) {
                  const index = this.tableData.indexOf(v)
                  this.tableData.splice(index, 1, this.temp)
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
      handleDelete(row) {
        this.temp = row
        this.dialogStatus = 'delete'
        this.dialogFormVisible = true
      },
      deleteData() {
        recruitmentApi.deleteData(this.temp.id).then(() => {
          const index = this.tableData.indexOf(this.temp)
          this.tableData.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.$notify({
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
        this.dialogFormVisible = false
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
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      handleDeleteSelection() {

      },
      handlePreview(row) {
        this.temp = row
        this.previewDialogVisible = true
      }
    }
  }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
