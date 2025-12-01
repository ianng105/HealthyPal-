   // Configuration
   	const m=parseInt(document.getElementById("min").textContent);
   	const M=parseInt(document.getElementById("max").textContent);
        const minPass = m;
        console.log(m);
        const maxPass = M;
        const maxValue = M+500;
        console.log(M);
        const unit = 'kcal';
        const size = 220;
        const strokeWidth = 14;

        // Elements
        const progressCircle = document.querySelector('.progress-circle');
        const valueSpan = document.querySelector('.value');
        const statusDiv = document.querySelector('.status');
        const input = document.getElementById('calorie-input');

        // Initial state
        let currentValue = window.initialCalories || 0;
       
        // Functions
        function getColor(value) {
            if (value === 0) return '#e5e7eb';
            if (value < minPass) return '#fbbf24';
            if (value <= maxPass) return '#22c55e';
            return '#ef4444';
        }

        function getStatus(value) {
            if (value === 0) return 'Start tracking';
            if (value < minPass) return 'Below target';
            if (value <= maxPass) return 'Healthy';
            return 'Over limit';
        }

        function updateProgress() {
            const cappedValue = Math.min(currentValue, maxValue + 500);
            const percentage = Math.min((cappedValue / maxValue) * 100, 100);
	    console.log("maxValue ",maxValue);
            const center = size / 2;
            const radius = (size - strokeWidth) / 2;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (percentage / 100) * circumference;

            const color = getColor(currentValue);
            const status = getStatus(currentValue);

            // Update circle
            progressCircle.setAttribute('stroke', color);
            progressCircle.style.strokeDashoffset = strokeDashoffset;

            // Update value with animation
            valueSpan.classList.remove('animate-scale');
            void valueSpan.offsetWidth; // Trigger reflow
            valueSpan.textContent = currentValue.toLocaleString() + " kcal";
            valueSpan.classList.add('animate-scale');

            // Update status with animation
            statusDiv.classList.remove('animate-fade-up');
            void statusDiv.offsetWidth;
            statusDiv.textContent = status;
            statusDiv.style.backgroundColor = `${color}20`; // 20% opacity
            statusDiv.style.color = currentValue === 0 ? '#6b7280' : color;
            statusDiv.classList.add('animate-fade-up');
        }
        
        function quickAdd(amount) {
            currentValue += amount;
            updateProgress();
        }

        function reset() {
            currentValue = 0;
            input.value = '';
            updateProgress();
        }

        // Initial update
        updateProgress();

        // Handle enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addValue();
            }
        });

// 获取弹窗元素
  const modal = document.getElementById('notificationModal');
  const modalMessage = document.getElementById('modalMessage');
  const modalOk = document.getElementById('modalOk');
  let currentForm = null;

  // 为所有添加表单添加提交事件监听
  document.querySelectorAll('.add-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      // 获取数量输入值
      const quantityInput = this.querySelector('input[name="quantity"]');
      const quantity = parseInt(quantityInput.value);
      const foodName = this.querySelector('input[name="food_name"]').value;
      
      // 验证数量是否大于0
      if (quantity <= 0) {
        alert('please submit more than 0');
        e.preventDefault();
        return;
      }
      
      // 阻止默认提交
      e.preventDefault();
      
      // 设置弹窗消息
      modalMessage.textContent = `${quantity} serving(s) of ${foodName} has been added to the eaten list`;
      
      // 保存当前表单引用
      currentForm = this;
      
      // 显示弹窗
      modal.style.display = 'flex';
    });
  });

  // 点击确定按钮提交表单
  modalOk.addEventListener('click', function() {
    // 隐藏弹窗
    modal.style.display = 'none';
    
    // 提交表单
    if (currentForm) {
      currentForm.submit();
    }
  });

  // 点击弹窗外部关闭弹窗
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
 
  

