let isAnimating = true;

window.requestAnimationFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function (callback) {
                  window.setTimeout(callback, 1000 / 30);
              };
})();

class Vector{
      constructor(x, y)
      {
            this.x = x || 0;
            this.y = y || 0;
      }
      x;
      y;
      set(x, y) {
          if (typeof x === 'object') {
              y = x.y;
              x = x.x;
          }
          this.x = x || 0;
          this.y = y || 0;
          return this;
      }
  
      add(other) {
          this.x += other.x;
          this.y += other.y;
          return this;
      }
  
      sub(other) {
          this.x -= other.x;
          this.y -= other.y;
          return this;
      }
  
      scale(alpha) {
          this.x *= alpha;
          this.y *= alpha;
          return this;
      }
  
      length() {
          return Math.sqrt(this.x * this.x + this.y * this.y);
      }
  
      distanceTo(other){
          let diffX = other.x - this.x,
              diffY = other.y - this.y;
          return Math.sqrt(diffX * diffX + diffY * diffY);
      }
  
      toString() {
          return '(x:' + this.x + ', y:' + this.y + ')';
      }
};

function substractVectors(a, b)
  {
      return new Vector(a.x - b.x, a.y - b.y);
};

const RADIUS_LIMIT = 65;
class City
{
      x; y; radius; targets;

      isMouseOver = false;
      dragging = false;
      destroyed = false;
      _easeRadius = 0;
      _dragDistance = null;
      _collapsing = false;

      constructor(x, y, radius, targets)
      {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.currentRadius = radius * 0.5;
  
            this._targets = {cities: targets.cities || []};
      }
  
      distanceTo(other)
      {
            let diffX = other.x - this.x,
                diffY = other.y - this.y;
            return Math.sqrt(diffX * diffX + diffY * diffY);
      }

      hitTest(vector)
      {
          return this.distanceTo(vector) < this.radius;
      }
  
      startDrag(dragStartPoint)
      {
          this._dragDistance = substractVectors(dragStartPoint, this);
          this.dragging = true;
      }
  
      drag(dragToPoint)
      {
          this.x = dragToPoint.x - this._dragDistance.x;
          this.y = dragToPoint.y - this._dragDistance.y;
      }
  
      endDrag()
      {
          this._dragDistance = null;
          this.dragging = false;
      }

      collapse()
      {
          this.currentRadius *= 1.75;
          this._collapsing = true;
      }
  
      render(context)
      {
          if (this.destroyed) return;
  
          let i, length;
  
          this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95;
          this.currentRadius += this._easeRadius;
          if (this.currentRadius < 0) this.currentRadius = 0;
  
          if (this._collapsing)
          {
              this.radius *= 0.75;
              if (this.currentRadius < 1) this.destroyed = true;
              this._draw(context);
              return;
          }
  
          let cities = this._targets.cities,
              city,
              area = this.radius * this.radius * Math.PI, garea;
  
          for (i = 0, length = cities.length; i < length; i++)
          {
              city = cities[i];
  
              if (city === this || city.destroyed) continue;
  
              if (
                  (this.currentRadius >= city.radius || this.dragging) &&
                  this.distanceTo(city) < (this.currentRadius + city.radius) * 0.85
              ) {
                  city.destroyed = true;
  
                  garea = city.radius * city.radius * Math.PI;
                  this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI);
                  this.radius = Math.sqrt((area + garea) / Math.PI);
              }
          }
  
          if (this.currentRadius > RADIUS_LIMIT) this.collapse();
  
          this._draw(context);
      }
  
      _draw(context)
      {
          let gradientient, radius;
  
          context.save();
  /*
          gradientient = context.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 5);
          gradientient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
          gradientient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          context.beginPath();
          context.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false);
          context.fillStyle = gradientient;
          context.fill();
  */
          radius = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3;
          /*gradientient = context.createRadialGradient(this.x, this.y, radius, this.x, this.y, this.currentRadius);
          gradientient.addColorStop(0, 'rgba(0, 0, 0, 1)');
          gradientient.addColorStop(1, Math.random() < 0.2 ? 'rgba(255, 196, 0, 0.15)' : 'rgba(103, 181, 191, 0.75)');*/
          context.beginPath();
          context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false);
          //context.fillStyle = gradientient;
          context.fill();
          context.restore();
      }
};
  
    export function setRandomSities(amount = 10)
    {
        while (amount--)
        {
            cities.push(new City(Math.random() * window.innerWidth, Math.random() * (window.innerHeight - 120) + 120, CITY_RADIUS, {
                cities: cities
            }));
        }
    }

    export function clearSities()
    {
        cities.length = 0;
    }
  
  // Initialize
  
      // Configs
  
      const BACKGROUND_COLOR      = 'rgba(11, 51, 56, 1)',
          CITY_RADIUS        = 10
  
  
      // lets
  
    let canvas, context,
          bufferCanvas, bufferContext,
          screenWidth, screenHeight,
          mouse = new Vector(),
          gradient;

    export let cities = [];
  
  
      // Event Listeners
  
      function resize()
      {
          screenWidth  = canvas.width  = window.innerWidth;
          screenHeight = canvas.height = window.innerHeight;
          bufferCanvas.width  = screenWidth;
          bufferCanvas.height = screenHeight;
          context   = canvas.getContext('2d');
          bufferContext = bufferCanvas.getContext('2d');
  
          let cx = canvas.width * 0.5,
              cy = canvas.height * 0.5;
  
          gradient = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      }
  
      function mouseMove(e)
      {
          mouse.set(e.clientX, e.clientY);
  
          let i, city, hit = false;
          for (i = cities.length - 1; i >= 0; i--) {
              city = cities[i];
              if ((!hit && city.hitTest(mouse)) || city.dragging)
                  city.isMouseOver = hit = true;
              else
                  city.isMouseOver = false;
          }
  
          canvas.style.cursor = hit ? 'pointer' : 'default';
      }
  
      function mouseDown(e)
      {
          for (let i = cities.length - 1; i >= 0; i--) {
              if (cities[i].isMouseOver) {
                  cities[i].startDrag(mouse);
                  return;
              }
          }
          cities.push(new City(e.clientX, e.clientY, CITY_RADIUS, {
              cities: cities
          }));
      }
  
      function mouseUp()
      {
          for (let i = 0, length = cities.length; i < length; i++) {
              if (cities[i].dragging) {
                  cities[i].endDrag();
                  break;
              }
          }
      }
  
      function doubleClick()
      {
          for (let i = cities.length - 1; i >= 0; i--) {
              if (cities[i].isMouseOver) {
                  cities[i].collapse();
                  break;
              }
          }
      }
  
      // Init
  
      canvas  = document.getElementById('c');
      bufferCanvas = document.createElement('canvas');
  
      window.addEventListener('resize', resize, false);
      resize(null);
  
      canvas.addEventListener('mousemove', mouseMove, false);
      canvas.addEventListener('mousedown', mouseDown, false);
      canvas.addEventListener('mouseup', mouseUp, false);
      canvas.addEventListener('dblclick', doubleClick, false);

      function stopAnimating()
      {
        isAnimating = false;

        window.removeEventListener('resize', resize, false);
        canvas.removeEventListener('mousemove', mouseMove, false);
        canvas.removeEventListener('mousedown', mouseDown, false);
        canvas.removeEventListener('mouseup', mouseUp, false);
        canvas.removeEventListener('dblclick', doubleClick, false);

        canvas.addEventListener('click', startAnimating);
      }

      export function startAnimating()
      {
        if (isAnimating)
            return;

        isAnimating = true;

        window.addEventListener('resize', resize, false);
        resize(null);
        canvas.addEventListener('mousemove', mouseMove, false);
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('dblclick', doubleClick, false);
        canvas.removeEventListener('click', startAnimating);

        loop();
      }

      export function drawLines(nodesOrder)
      {
        stopAnimating();

        //requestAnimationFrame(()=>{
            context.save();
            loop();
            context.beginPath()
    
            if (nodesOrder.length != 0)
                context.moveTo(cities[nodesOrder.at(-1)].x, cities[nodesOrder.at(-1)].y);
    
            for (let i = 0, length = nodesOrder.length; i < length; ++i)
            {
                context.lineWidth = 3;
                context.lineTo(cities[nodesOrder[i]].x, cities[nodesOrder[i]].y);
                context.stroke();
            }
        
            context.restore();
        })
      }
  
      // Start Update

      let loop = function(shouldCheck = false)
      {
          if(shouldCheck && !isAnimating)
            return;

          let i, length, city;
  
          context.save();
          context.fillStyle = BACKGROUND_COLOR;
          context.fillRect(0, 0, screenWidth, screenHeight);
          context.fillStyle = gradient;
          context.fillRect(0, 0, screenWidth, screenHeight);
          context.restore();
  
          for (i = 0, length = cities.length; i < length; i++) {
              city = cities[i];
              if (city.dragging) city.drag(mouse);
              city.render(context);
              if (city.destroyed) {
                  cities.splice(i, 1);
                  length--;
                  i--;
              }
          }
        
          bufferContext.save();
          bufferContext.globalCompositeOperation = 'destination-out';
          bufferContext.globalAlpha = 0.15;
          bufferContext.fillRect(0, 0, screenWidth, screenHeight);
          bufferContext.restore();

          context.drawImage(bufferCanvas, 0, 0);

          if (isAnimating)
            requestAnimationFrame(loop, true);
      };
      loop();