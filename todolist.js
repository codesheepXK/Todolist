//存取localStorage中的数据
var store = {
        save(key, value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        fetch(key) {
            return JSON.parse(window.localStorage.getItem(key)) || [];
        }
    }
    //list取出所有的值
var list = store.fetch("storeData");

var vm = new Vue({
    el: ".main",
    data: {
        list,
        todo: '',
        edtorTodos: '', //记录正在编辑的数据,
        beforeTitle: "", //记录正在编辑的数据的title
        visibility: "all" //通过这个属性值的变化对数据进行筛选
    },
    watch: {

        list: {
            handler: function() {
                store.save("storeData", this.list);
            },
            deep: true
        }

    },
    methods: {
        enterFn(ev) { //添加任务
            if (this.todo == "") { return; }
            this.list.push({
                title: this.todo,
                isComplete: false
            });
            this.todo = "";
        },
        delFn(item) { //删除任务
            var index = this.list.indexOf(item);
            this.list.splice(index, 1)
        },
        edtorTodo(item) { //编辑任务
            this.beforeTitle = item.title;
            this.edtorTodos = item;
        },
        edtoEnd(item) { //编辑完成
            this.edtorTodos = "";
        },
        cancelEdit(item) { //取消编辑
            item.title = this.beforeTitle;
            this.beforeTitle = '';
            this.edtorTodos = '';
        }
    },
    directives: {
        "focus": {
            update(el, binding) {
                if (binding.value) {
                    el.focus();
                }
            }
        }
    },
    computed: {
        unComplete() {
            return this.list.filter(item => {
                return !item.isComplete
            }).length
        },
        filterData() {
            var filter = {
                all: function(list) {
                    return list;
                },
                completed: function(list) {
                    return list.filter(item => {
                        return item.isComplete;
                    })
                },
                unCompleted: function(list) {
                    return list.filter(item => {
                        return !item.isComplete;
                    })
                }
            }
            return filter[this.visibility] ? filter[this.visibility](list) : list;
        }

    }
});

function hashFn() {
    var hash = window.location.hash.slice(1);
    vm.visibility = hash;
}
hashFn();
window.addEventListener('hashchange', hashFn);