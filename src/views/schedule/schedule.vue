<template>
  <div class="app-container calendar-list-container">
    <data-tables-server :total="total"
                        :action-col-def="actionColDef" :load-data="loadData"
                        :data="tableData">
      <el-table-column v-for="title in extraTitles" :key="title.id" :prop="title.prop" :label="title.label"
                       sortable="custom">
      </el-table-column>
      <el-table-column v-for="title in titles" :key="title.id" :prop="title.prop" :label="title.label"
                       sortable="custom">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="applyStatusType[scope.row.applyStatus].type">{{applyStatusType[scope.row.applyStatus].label}}
          </el-tag>
        </template>
      </el-table-column>
    </data-tables-server>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form v-if="dialogStatus!='delete'" :rules="rules" ref="dataForm" :model="temp" label-width="100px">
        <!--label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'-->
        <!--<el-form-item v-for="title in titles" :key="title.prop" :label="title.label" :model="temp[title.prop]">-->
        <!--<el-input v-model="temp[title.prop]" placeholder="" type="textarea" autosize></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="面试时间">
          <el-date-picker v-model="temp.interviewTime" type="datetime" format="yyyy年MM月dd日 HH:mm" value-format="timestamp"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as appointmentApi from '@/api/appointment/appointment'
  import applyStatusType from '@/utils/applyStatusType'
  import * as applyApi from '@/api/apply/apply'

  export default {
    name: 'schedule',
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
        }],
        temp: {
          id: Number
        },
        applyData: [],
        applyStatusType,
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
            name: '安排',
            type: 'primary',
            handler: row => {
              this.handleUpdate(row)
            }
          }]
        }
      }
    },
    created() {
    },
    methods: {
      loadData(queryInfo) {
        queryInfo.applyStatus = [3, 4, 7, 8, 11, 12]
        return applyApi.fetchByStatus(queryInfo).then(response => {
          this.tableData = response.data.content
          this.total = response.data.totalElements
        })
      },
      resetTemp() {
        this.temp = {
          id: ''
        }
      },
      handleUpdate(row) {
        this.applyData = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        if (this.applyData.applyStatus === 3 || this.applyData.applyStatus === 7 || this.applyData.applyStatus === 11) {
          this.resetTemp()
          this.temp.applyId = this.applyData.id
        } else {
          appointmentApi.findLatest(this.applyData.id).then((res) => {
            this.temp = Object.assign({}, res.data)
          })
        }
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.applyData.applyStatus === 3 || this.applyData.applyStatus === 7 || this.applyData.applyStatus === 11) {
              this.temp.applyStatus += 1
              appointmentApi.createData(this.temp).then((res) => {
                for (const v of this.tableData) {
                  if (v.id === res.applyId) {
                    v.applyStatus = res.applyStatus
                    break
                  }
                }
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '安排成功',
                  type: 'success'
                })
              })
            } else {
              const tempData = Object.assign({}, this.temp)
              appointmentApi.updateData(tempData.id, tempData).then((res) => {
                for (const v of this.tableData) {
                  if (v.id === res.data.id) {
                    const index = this.tableData.indexOf(v)
                    this.tableData.splice(index, 1, res.data)
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
          }
        })
      },
      handleDelete(row) {
        this.temp = row
        this.dialogStatus = 'delete'
        this.dialogFormVisible = true
      },
      deleteData() {
        applyApi.deleteData(this.temp.id).then(() => {
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
      }
    }
  }
</script>

