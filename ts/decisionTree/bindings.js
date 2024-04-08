export let selectedFilename;

// file load
$('#chooseFile').bind('change', function () {
    selectedFilename = $("#chooseFile").val();
    if (/^\s*$/.test(selectedFilename)) {
      $(".file-upload").removeClass('active');
      $("#noFile").text("No file chosen..."); 
    }
    else {
      $(".file-upload").addClass('active');
      $("#noFile").text(selectedFilename.replace("C:\\fakepath\\", "")); 
    }
});

//


const movableDiv = document.getElementById('movable');

let diffY,
    diffX,
    elmWidth,
    elmHeight,
    isMouseDown = false;

function mouseDown(e) {
  isMouseDown = true;
  // get initial mousedown coordinated
  const mouseY = e.clientY;
  const mouseX = e.clientX;
  
  // get element top and left positions
  const elmY = movableDiv.offsetTop;
  const elmX = movableDiv.offsetLeft;
  
  // get elm dimensions
  elmWidth = movableDiv.offsetWidth;
  elmHeight = movableDiv.offsetHeight;
  
  // get diff from (0,0) to mousedown point
  diffY = mouseY - elmY;
  diffX = mouseX - elmX;
}


function mouseMove(e)
{
  if (!isMouseDown) return;
  // get new mouse coordinates
  const newMouseY = e.clientY;
  const newMouseX = e.clientX;
  
  // calc new top, left pos of elm
  let newElmTop = newMouseY - diffY,
      newElmLeft = newMouseX - diffX;

  moveElm(newElmTop, newElmLeft);
}

// move elm
function moveElm(yPos, xPos) {
  movableDiv.style.top = yPos + 'px';
  movableDiv.style.left = xPos + 'px';
}

function mouseUp() {
  isMouseDown = false;
}

movableDiv.addEventListener('mousedown', mouseDown);
document.addEventListener('mousemove', mouseMove);
document.addEventListener('mouseup', mouseUp);
