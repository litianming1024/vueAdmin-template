<template>
  <div class="app-container calendar-list-container">
    <data-tables-server :total="total"
                        :action-col-def="actionColDef"
                        :load-data="loadData"
                        :data="tableData">
      <el-table-column v-for="title in extraTitles" :key="title.id" :prop="title.prop" :label="title.label"
                       sortable="custom">
      </el-table-column>
      <el-table-column label="面试时间"
                       sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.interviewTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="applyStatusType[scope.row.applyStatus].type">{{applyStatusType[scope.row.applyStatus].label}}
          </el-tag>
        </template>
      </el-table-column>
    </data-tables-server>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center fullscreen>
      <el-form v-if="dialogStatus!='delete'" :rules="rules" ref="dataForm" :model="temp" label-width="100px">
        <!--label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'-->
        <el-form-item label="投递序号">
          <span>{{temp.applyId}}</span>
        </el-form-item>
        <el-form-item label="简历序号">
          <span>{{temp.resumeId}}</span>
        </el-form-item>
        <el-form-item v-for="title in titles" :key="title.prop" :label="title.label" :model="temp[title.prop]">
          <el-input v-model="temp[title.prop]" placeholder="" type="textarea" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-if="dialogStatus=='delete'" type="danger" @click="deleteData">删除</el-button>
        <el-button type="success" @click="handleChangeApplyStatus(7)">通过</el-button>
        <el-button type="danger" @click="handleChangeApplyStatus(6)">未通过</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">更新</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as appointmentApi from '@/api/appointment/appointment'
  import applyStatusType from '@/utils/applyStatusType'
  import * as applyApi from '@/api/apply/apply'

  export default {
    name: 'retestAppointment',
    data() {
      return {
        tableData: [],
        total: 0,
        extraTitles: [{
          prop: 'id',
          label: '序号'
        }, {
          prop: 'resumeId',
          label: '简历序号'
        }, {
          prop: 'applyId',
          label: '投递序号'
        }],
        titles: [{
          prop: 'comment',
          label: '评价'
        }],
        applyStatusType,
        temp: {
          id: Number
        },
        downloadLoading: false,
        dialogFormVisible: false,
        dialogStatus: '',
        multipleSelection: [],
        applyData: {},
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
            name: '面试',
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
        queryInfo.applyStatus = [9]
        return appointmentApi.fetchByApplyStatus(queryInfo).then(response => {
          this.tableData = response.data.content
          this.total = response.data.totalElements
        })
      },
      resetTemp() {
        this.temp = {
          id: Number
        }
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        applyApi.getData(this.temp.applyId).then((res) => {
          this.applyData = res.data
        })
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
        })
      },
      handleDelete(row) {
        this.temp = row
        this.dialogStatus = 'delete'
        this.dialogFormVisible = true
      },
      handleChangeApplyStatus(status) {
        // 不论通不通过都不在面试管理中显示
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            appointmentApi.updateData(tempData.id, tempData).then((res) => {
              for (const v of this.tableData) {
                if (v.id === res.data.id) {
                  const index = this.tableData.indexOf(v)
                  this.tableData.splice(index, 1)
                  break
                }
              }
            })
          }
          const tempData = Object.assign({}, this.applyData)
          tempData.applyStatus = status
          applyApi.updateData(tempData.id, tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success'
            })
          })
        })
      }
    }
  }
</script>
