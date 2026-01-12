# 帧中继的故障排除

正如早先所指出的，电信公司在将咱们的  DLCI 映射到错误端口或让编号出错时，他们常会让映射信息出错。在给他们打电话或提交工单前，咱们将需要通过使用以下命令，证明是他们有问题：


- `show frame-relay pvc`
- `show frame-relay lmi`
- `show frame-relay map`
- `debug frame-relay pvc`
- `debug frame-relay lmi`

## 帧中继错误

令人恼火的是，考试中他们有时喜欢问咱们一些有关帧中继链路错误的问题，因此下面时咱们需要了解一些内容：

- BECN -— 一些数据帧在数据帧传输的相反方向，遇到了拥塞
- FECN -— 在数据帧传输方向上遇到了拥塞


