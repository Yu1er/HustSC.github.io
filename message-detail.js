document.addEventListener('DOMContentLoaded', function() {
    // 获取URL中的id参数
    const urlParams = new URLSearchParams(window.location.search);
    const messageId = urlParams.get('id');

    // 获取用户发布的留言
    const userMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
    const userMessage = userMessages.find(msg => msg.id === parseInt(messageId));

    // 留言内容数据
    const messageData = {
        1: {
            title: "如何申请法律援助？",
            time: "2024-01-20 14:30",
            content: "我现在遇到了一些法律问题，但是经济条件有限。想了解一下申请法律援助需要哪些条件和材料？希望能得到专业的建议。",
            reply: {
                time: "2024-01-20 15:00",
                content: `<p>您好，法律援助申请需要提供以下材料：</p>
                <ol>
                    <li>身份证明（身份证原件及复印件）</li>
                    <li>经济困难证明（低保证、特困证明等）</li>
                    <li>案件相关材料（证据材料、案件描述等）</li>
                </ol>
                <p>建议您先到当地法律援助中心咨询具体情况，工作人员会为您详细介绍申请流程。</p>`
            }
        },
        2: {
            title: "工伤认定需要多长时间？",
            time: "2024-01-19 16:45",
            content: "在工作期间受伤，已经提交了工伤认定申请，想了解一下一般需要等待多长时间？有什么需要特别注意的事项吗？",
            reply: {
                time: "2024-01-19 17:30",
                content: `<p>您好，关于工伤认定的时间和注意事项说明如下：</p>
                <ol>
                    <li>一般工伤认定时限为15个工作日，特殊情况可能延长至30个工作日</li>
                    <li>需要鉴定的，鉴定时间不计入工伤认定时限</li>
                    <li>材料不完整的，人社部门会要求在5个工作日内补充</li>
                </ol>
                <p>建议您保留好所有相关证据材料，包括事故发生时的监控录像、证人证言、医疗记录等。如有需要，可以寻求工会组织的帮助。</p>`
            }
        },
        3: {
            title: "劳动合同到期未续签如何处理？",
            time: "2024-01-18 09:20",
            content: "我的劳动合同即将到期，但公司一直没有谈续签的事情，如果到期后继续上班是什么法律关系？",
            reply: {
                time: "2024-01-18 10:15",
                content: `<p>关于劳动合同到期未续签的情况说明如下：</p>
                <ol>
                    <li>如果双方未签订书面续订合同但继续履行原劳动合同，视为双方同意继续履行原劳动合同</li>
                    <li>建议主动与用人单位沟通续签事宜，以书面形式确认劳动关系</li>
                    <li>如用人单位拒绝续签，应当依法支付经济补偿金</li>
                </ol>
                <p>建议您保留好出勤、工资等相关证据，必要时可以向劳动监察部门投诉。</p>`
            }
        },
        4: {
            title: "房屋租赁合同纠纷怎么解决？",
            time: "2024-01-17 15:10",
            content: "我是房屋承租人，与房东在租金支付方面产生了争议，请问应该如何维护自己的权益？",
            reply: {
                time: "2024-01-17 16:00",
                content: `<p>关于房屋租赁合同纠纷，建议按以下步骤处理：</p>
                <ol>
                    <li>首先查看租赁合同约定，确认双方权利义务</li>
                    <li>保留所有租金支付凭证、通讯记录等证据</li>
                    <li>尝试与房东进行协商沟通，最好形成书面记录</li>
                    <li>如协商不成，可以：
                        <ul>
                            <li>向当地住建部门投诉</li>
                            <li>申请调解委员会调解</li>
                            <li>向法院提起诉讼</li>
                        </ul>
                    </li>
                </ol>
                <p>建议您在处理纠纷过程中保持理性，通过合法途径维护自身权益。</p>`
            }
        },
        5: {
            title: "加班费如何计算？",
            time: "2024-01-16 11:25",
            content: "公司经常安排加班，但是加班费计算方式不透明，想了解一下法律规定的加班费计算标准。",
            reply: {
                time: "2024-01-16 14:00",
                content: `<p>根据《劳动法》规定，加班费的计算标准如下：</p>
                <ol>
                    <li>工作日加班：不低于小时工资的150%</li>
                    <li>休息日加班：不低于小时工资的200%</li>
                    <li>法定节假日加班：不低于小时工资的300%</li>
                </ol>
                <p>小时工资的计算方法：</p>
                <ul>
                    <li>月工资制：月工资÷21.75÷8</li>
                    <li>日工资制：日工资÷8</li>
                </ul>
                <p>如果发现公司存在违法行为，可以向劳动监察部门投诉。建议您保留好考勤记录等相关证据。</p>`
            }
        },
        6: {
            title: "未成年人打工的法律规定",
            time: "2024-01-15 10:20",
            content: "我是一名高中生，想利用寒假时间打工赚取一些生活费，请问对未成年人打工有什么法律规定和限制吗？",
            reply: {
                time: "2024-01-15 11:00",
                content: `<p>关于未成年人打工，法律有以下规定：</p>
                <ol>
                    <li>用人单位不得招用未满16周岁的未成年人</li>
                    <li>16-18周岁的未成年人打工需要注意：
                        <ul>
                            <li>不得从事过重、有毒、有害等危险工作</li>
                            <li>工作时间不得超过每日8小时</li>
                            <li>不得安排夜班工作</li>
                        </ul>
                    </li>
                    <li>建议选择正规企业，签订书面劳动合同</li>
                    <li>建议在监护人知情并同意的情况下打工</li>
                </ol>
                <p>为了保护自身权益，建议您：</p>
                <ul>
                    <li>保留工作相关证据（合同、工资单等）</li>
                    <li>选择适合未成年人的工作岗位</li>
                    <li>遇到问题及时向监护人或有关部门求助</li>
                </ul>`
            }
        },
        7: {
            title: "试用期解除劳动合同的补偿",
            time: "2024-01-14 14:15",
            content: "公司在试用期以'不符合录用条件'为由解除了劳动合同，请问我能获得补偿吗？",
            reply: {
                time: "2024-01-14 15:30",
                content: `<p>关于试用期解除劳动合同的补偿问题，需要区分以下情况：</p>
                <ol>
                    <li>用人单位证明不符合录用条件的：
                        <ul>
                            <li>无需支付经济补偿金</li>
                            <li>应当说明理由并提供证据</li>
                        </ul>
                    </li>
                    <li>用人单位无法证明不符合录用条件：
                        <ul>
                            <li>应当支付经济补偿金</li>
                            <li>违法解除的可要求额外支付赔偿金</li>
                        </ul>
                    </li>
                </ol>
                <p>建议您：</p>
                <ol>
                    <li>查看劳动合同中约定的录用条件</li>
                    <li>保留考核、工作记录等相关证据</li>
                    <li>如有争议可申请劳动仲裁</li>
                </ol>`
            }
        },
        8: {
            title: "租房合同违约金过高怎么办",
            time: "2024-01-13 09:45",
            content: "我因工作调动需要提前解除租房合同，但合同约定的违约金太高，请问有什么解决办法？",
            reply: {
                time: "2024-01-13 10:30",
                content: `<p>关于租房合同违约金过高的问题，可以从以下几个方面处理：</p>
                <ol>
                    <li>法律规定：
                        <ul>
                            <li>过分高于造成的损失的违约金，可以请求法院适当减少</li>
                            <li>违约金一般不应超过合同总额的30%</li>
                        </ul>
                    </li>
                    <li>建议处理方式：
                        <ul>
                            <li>与房东协商调整违约金金额</li>
                            <li>寻找新租客承租，减少房东损失</li>
                            <li>提供工作调动证明，说明确有正当理由</li>
                        </ul>
                    </li>
                </ol>
                <p>如协商不成，可以：</p>
                <ol>
                    <li>向住建部门投诉</li>
                    <li>申请调解</li>
                    <li>向法院起诉要求调整违约金</li>
                </ol>`
            }
        },
        9: {
            title: "工伤康复期间的工资待遇",
            time: "2024-01-12 16:20",
            content: "我在工作中受伤被认定为工伤，现在正在康复治疗，想了解康复期间的工资应该如何计算？",
            reply: {
                time: "2024-01-12 17:00",
                content: `<p>工伤康复期间的工资待遇规定如下：</p>
                <ol>
                    <li>停工留薪期间：
                        <ul>
                            <li>原工资福利待遇不变</li>
                            <li>一般不超过12个月</li>
                        </ul>
                    </li>
                    <li>停工留薪期满：
                        <ul>
                            <li>伤情未完全好转的，可延长期限</li>
                            <li>延长期间生活费不低于当地最低工资标准</li>
                        </ul>
                    </li>
                    <li>其他待遇：
                        <ul>
                            <li>医疗费用由工伤保险基金支付</li>
                            <li>享受护理费、伙食补助费等待遇</li>
                        </ul>
                    </li>
                </ol>`
            }
        },
        10: {
            title: "婚内财产约定需要公证吗",
            time: "2024-01-11 11:30",
            content: "我和配偶想对婚内财产进行约定，请问是否一定要到公证处公证？效力有什么区别？",
            reply: {
                time: "2024-01-11 14:00",
                content: `<p>关于婚内财产约定的问题，说明如下：</p>
                <ol>
                    <li>法律效力：
                        <ul>
                            <li>书面约定即具有法律效力，不强制要求公证</li>
                            <li>公证可以增加约定的证明力</li>
                        </ul>
                    </li>
                    <li>建议办理公证的情况：
                        <ul>
                            <li>财产价值较大</li>
                            <li>财产关系复杂</li>
                            <li>涉及不动产等重要财产</li>
                        </ul>
                    </li>
                </ol>
                <p>注意事项：</p>
                <ol>
                    <li>约定内容要具体明确</li>
                    <li>双方真实意思表示</li>
                    <li>不违反法律强制性规定</li>
                    <li>建议保留相关凭证</li>
                </ol>`
            }
        }
    };

    // 获取页面元素
    const titleElement = document.querySelector('.message-title');
    const timeElement = document.querySelector('.post-time');
    const contentElement = document.querySelector('.message-content');
    const officialReply = document.querySelector('.official-reply');

    // 如果是用户发布的留言
    if (userMessage) {
        // 更新页面内容
        titleElement.textContent = userMessage.title;
        timeElement.innerHTML = `<i class="far fa-clock"></i> 发布于 ${userMessage.date}`;
        contentElement.innerHTML = `<p>${userMessage.content}</p>`;

        // 如果是待回复状态，隐藏官方回复部分
        if (userMessage.status === 'pending') {
            officialReply.style.display = 'none';
        }
    } else {
        // 如果是预设的留言，使用现有的 messageData
        if (messageId && messageData[messageId]) {
            const message = messageData[messageId];
            
            // 更新页面内容
            titleElement.textContent = message.title;
            timeElement.innerHTML = `<i class="far fa-clock"></i> 发布于 ${message.time}`;
            contentElement.innerHTML = `<p>${message.content}</p>`;

            // 更新官方回复内容
            const replyTimeElement = officialReply.querySelector('.reply-time');
            const replyContentElement = officialReply.querySelector('.reply-content');
            replyTimeElement.innerHTML = `<i class="far fa-clock"></i> ${message.reply.time}`;
            replyContentElement.innerHTML = message.reply.content;
        } else {
            // 如果没有找到对应的留言，重定向到留言板
            window.location.href = 'message-board.html';
        }
    }
}); 