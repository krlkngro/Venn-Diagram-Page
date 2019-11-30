union = function(set1,set2) {
    let result = new Set(set1);
    for (let element of set2) {
        result.add(element);
    }
    return result;
};

intersection = function(set1, set2) {
    let result = new Set();
    for (let element of set1) {
        if (set2.has(element)) {
            result.add(element);
        }
    }
    return result;
};

difference = function(set1, set2) {
    let result = new Set(set1);
    for (let element of set1) {
        if (set2.has(element)) {
            result.delete(element);
        }
    }
    return result;
};

symmetricDifference = function(set1, set2) {
    return union(difference(set1,set2), difference(set2,set1))
};

solveEquation = function(equation, set) {
    let counter = 0;
    let previousPart = "";
    let nextPart = "";
    while (equation.length > 0) {
        if (Object.keys(set).includes(equation[0])) {
            if (equation[1] === "'") {
                previousPart = difference(set["Universaalhulk"], set[equation[0]]);
                counter += 2;
                equation = equation.slice(2);
            } else {
                previousPart = set[equation[0]];
                equation = equation.slice(1);
                counter += 1;
            }
        } else if (equation[0] === "-") {
            equation = equation.slice(1);
            counter += 1;
            if (equation[0] === "(") {
                let result = solveEquation(equation.slice(1), set);
                nextPart = result[0];
                counter += 1 + result[1];
                equation = equation.slice(result[1] + 1);
            } else if (equation[1] === "'") {
                nextPart = difference(set["Universaalhulk"], set[equation[0]]);
                counter += 2;
                equation = equation.slice(2);
            } else {
                nextPart = set[equation[0]];
                equation = equation.slice(1);
                counter += 1;
            }
            previousPart = difference(previousPart,nextPart);
        } else if (equation[0] === "|") {
            equation = equation.slice(1);
            counter += 1;
            if (equation[0] === "(") {
                let result = solveEquation(equation.slice(1), set);
                nextPart = result[0];
                counter += 1 + result[1];
                equation = equation.slice(result[1] + 1);
            } else if (equation[1] === "'") {
                nextPart = difference(set["Universaalhulk"], set[equation[0]]);
                counter += 2;
                equation = equation.slice(2);
            } else {
                nextPart = set[equation[0]];
                equation = equation.slice(1);
                counter += 1;
            }
            previousPart = union(previousPart,nextPart);
        } else if (equation[0] === "&") {
            equation = equation.slice(1);
            counter += 1;
            if (equation[0] === "(") {
                let result = solveEquation(equation.slice(1), set);
                nextPart = result[0];
                counter += 1 + result[1];
                equation = equation.slice(result[1] + 1);
            } else if (equation[1] === "'") {
                nextPart = difference(set["Universaalhulk"], set[equation[0]]);
                counter += 2;
                equation = equation.slice(2);
            } else {
                nextPart = set[equation[0]];
                equation = equation.slice(1);
                counter += 1;
            }
            previousPart = intersection(previousPart,nextPart);
        } else if (equation[0] === "^") {
            equation = equation.slice(1);
            counter += 1;
            if (equation[0] === "(") {
                let result = solveEquation(equation.slice(1), set);
                nextPart = result[0];
                counter += 1 + result[1];
                equation = equation.slice(result[1] + 1);
            } else if (equation[1] === "'") {
                nextPart = difference(set["Universaalhulk"], set[equation[0]]);
                counter += 2;
                equation = equation.slice(2);
            } else {
                nextPart = set[equation[0]];
                equation = equation.slice(1);
                counter += 1;
            }
            previousPart = symmetricDifference(previousPart,nextPart);
        } else if (equation[0] === "(") {
            let result = solveEquation(equation.slice(1), set);
            previousPart = result[0];
            counter += 1 + result[1];
            equation = equation.slice(result[1] + 1);
        } else if (equation[0] === ")") {
            counter += 1;
            return ([previousPart, counter])
        } else if (equation[0] === "'") {
            previousPart = difference(set["Universaalhulk"], previousPart);
            counter += 1;
            equation = equation.slice(1);
        }
    }
    return [previousPart, counter]
};
translateInput = function() {
    let equation = document.getElementById("equation").value.replace(/\s+/g, '');
    equation = equation.toUpperCase();
    let operations = ["|", "&", "-", "^", "'", "(", ")"];
    let setNames = [];
    for (let i = 0; i < equation.length; i++) {
        if (!(setNames.includes(equation[i]) || operations.includes(equation[i]) || equation[i] === " ")) {
            setNames.push(equation[i]);
        }
    }
    if (setNames.length > 8) {
        if (confirm("Üle 8 hulga ei ole soovitatav sisestada, kuna nende joonistamine võtab kaua aega ning viimaste hulkade osad on nägemiseks liiga väikesed. Vajutage 'OK' et katkestada joonistamine või 'Cancel' et siiski jätkata.")) {
            return false;
        }
    }
    setNames.sort();
    let setValues = {};
    for (let i = 0; i < setNames.length; i++) {
        setValues[setNames[i]] = Array.from(Array(Math.pow(2, setNames.length-1)).keys()).map(x=>(Math.ceil((x+1)/Math.pow(2,i)) + Math.floor(x/Math.pow(2,i)))*(Math.pow(2,i)) + (x%(Math.pow(2, i))));
        setValues[setNames[i]] = new Set(setValues[setNames[i]]);
    }
    setValues["Universaalhulk"] = Array.from(Array(Math.pow(2, setNames.length)).keys());
    return [solveEquation(equation, setValues), setNames];
};
distance = function(point1, point2) {
    return (Math.sqrt(Math.pow((point2[0]-point1[0]),2) + Math.pow((point2[1]-point1[1]),2)));
};
pointsOfIntersection = function(P0, P1, r) {
    let d = distance(P0,P1);
    if (d.toFixed(7) !== (r*2).toFixed(7)) {
        let a = (d)/(2);
        let h = Math.sqrt(Math.pow(r,2)-Math.pow(a,2));
        let P2 = [P0[0]+a*(P1[0]-P0[0])/d, P0[1]+a*(P1[1]-P0[1])/d];
        return [[P2[0]+h*(P1[1]-P0[1])/d,P2[1]-h*(P1[0]-P0[0])/d],[P2[0]-h*(P1[1]-P0[1])/d, P2[1]+h*(P1[0]-P0[0])/d]]
    } else {
        return [(P1[0]+P0[0])/2, (P1[1]+P0[1])/2]
    }
};
drawCircles = function(canvas, setNames, coloredParts, highlightedPart, drawStyle) {
    let drawnParts = new Set();
    let ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    if (drawStyle === "highlight") {
        ctx.globalCompositeOperation = "lighten";
    }
    let radius = 0.25 * Math.min(canvas.width, canvas.height);
    let centers = [];
    let midpoint = [canvas.width / 2, canvas.height / 2];
    for (let i = 0; i < setNames.length; i++) {
        centers.push([midpoint[0] + radius * (2 / 3) * Math.cos(2 * Math.PI * i / setNames.length), midpoint[1] + radius * (2 / 3) * Math.sin(2 * Math.PI * i / setNames.length)]);
    }
    for (let i = 1; i <= centers.length; i++) {
        if (i === 1) {
            for (let n = 0; n < (i === setNames.length ? 1 : setNames.length); n++) {
                ctx.fillStyle = "white";
                if (drawStyle === "highlight") {
                    if (coloredParts.has(Math.pow(2, n))) {
                        ctx.fillStyle = "lime";
                    } else {
                        continue;
                    }
                } else if (coloredParts.has(Math.pow(2, n))) {
                    ctx.fillStyle = "blue";
                    if (Math.pow(2, n) === highlightedPart) {
                        ctx.fillStyle = "lime";
                    }
                }
                ctx.beginPath();
                ctx.arc(centers[n][0],centers[n][1],radius,0,2*Math.PI);
                if (drawStyle !== "line") {
                    ctx.fill();
                }
                ctx.stroke();
                if (drawStyle === "highlight") {
                    break;
                }
                drawnParts.add(Math.pow(2, n));
                ctx.fillStyle = "black";
                let fontSize = 15;
                ctx.font = JSON.stringify(fontSize) + "px Arial";
                let xChange = (centers[n][0]-midpoint[0])/distance(midpoint,centers[n]);
                let yChange = (centers[n][1]-midpoint[1])/distance(midpoint,centers[n]);
                let xAdjustment = 0;
                let yAdjustment = 0;
                if (yChange < 0) {
                    yAdjustment = yChange*fontSize + 1;
                }
                if (Math.abs(xChange) > Math.abs(yChange)) {
                    xAdjustment = -1*((Math.abs(xChange) - Math.abs(yChange)) * fontSize - 1 - (fontSize/2)*(xChange < 0));
                }
                ctx.fillText(setNames[n], (midpoint[0]) + (xChange) * (distance(midpoint,centers[n])+radius + 15 + xAdjustment), (midpoint[1]) + (yChange)* (distance(midpoint,centers[n])+radius + 15 + yAdjustment));
            }
        } else if (drawStyle === "line") {
            return;
        } else {
            for (let n = 0; n < (i === setNames.length ? 1 : setNames.length); n++) {
                let intersectionPoints = [];
                for (let m = 0; m < (i > 2) * i + (i === 2); m++) {
                    let points = pointsOfIntersection(centers[(n + m) % setNames.length], centers[(n + (m + 1) % i) % setNames.length], radius);
                    for (let j = 1; j < i - 1; j++) {
                        if (distance(centers[(n + (m + 1 + j) % (i)) % setNames.length], points[0]) > radius) {
                            points.shift();
                            break;
                        } else if (distance(centers[(n + (m + 1 + j) % (i)) % setNames.length], points[1]) > radius) {
                            points.pop();
                            break;
                        }
                    }
                    for (let point of points) {
                        if (!JSON.stringify(intersectionPoints).includes(JSON.stringify(point))) {
                            intersectionPoints.push(point);
                        }
                    }
                }
                ctx.beginPath();
                let number = 0;
                for (let m = 0; m < intersectionPoints.length; m++) {
                    number += Math.pow(2, ((n + m) % setNames.length));
                    let center = centers[(m + n) % setNames.length];
                    let cosAlpha = 1 - Math.pow(distance(intersectionPoints[(m) % intersectionPoints.length], intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length]), 2) / (2 * Math.pow(radius, 2));
                    let alpha = Math.acos(cosAlpha);
                    let startPoint = [];
                    if ((intersectionPoints[(m) % intersectionPoints.length][1] > center[1]) && (intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][1] > center[1])) {
                        if (intersectionPoints[(m) % intersectionPoints.length][0] > intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][0]) {
                            startPoint = intersectionPoints[(m) % intersectionPoints.length];
                        } else {
                            startPoint = intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length];
                        }
                    } else if ((intersectionPoints[(m) % intersectionPoints.length][1] < center[1]) && (intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][1] < center[1])) {
                        if (intersectionPoints[(m) % intersectionPoints.length][0] < intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][0]) {
                            startPoint = intersectionPoints[(m) % intersectionPoints.length];
                        } else {
                            startPoint = intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length];
                        }
                    } else {
                        if ((intersectionPoints[(m) % intersectionPoints.length][1] + intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][1]) / 2 === center[1]) {
                            if ((intersectionPoints[(m) % intersectionPoints.length][0] + intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][0]) / 2 >= center[0]) {
                                if (intersectionPoints[(m) % intersectionPoints.length][1] < intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][1]) {
                                    startPoint = intersectionPoints[(m) % intersectionPoints.length];
                                } else {
                                    startPoint = intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length];
                                }
                            } else {
                                if (intersectionPoints[(m) % intersectionPoints.length][1] > intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][1]) {
                                    startPoint = intersectionPoints[(m) % intersectionPoints.length];
                                } else {
                                    startPoint = intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length];
                                }
                            }
                        } else {
                            if ((intersectionPoints[(m) % intersectionPoints.length][1] + intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][1]) / 2 > center[1]) {
                                if (intersectionPoints[(m) % intersectionPoints.length][0] > intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][0]) {
                                    startPoint = intersectionPoints[(m) % intersectionPoints.length];
                                } else {
                                    startPoint = intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length];
                                }
                            } else {
                                if (intersectionPoints[(m) % intersectionPoints.length][0] <= intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length][0]) {
                                    startPoint = intersectionPoints[(m) % intersectionPoints.length];
                                } else {
                                    startPoint = intersectionPoints[((m - 1) >= 0 ? (m - 1) : intersectionPoints.length + (m - 1)) % intersectionPoints.length];
                                }
                            }
                        }
                    }
                    let circleStart = [center[0] + radius, center[1]];
                    let cosStart = 1 - Math.pow(distance(startPoint, circleStart), 2) / (2 * Math.pow(radius, 2));
                    let startDegree = 0;
                    if (startPoint[1] >= circleStart[1]) {
                        startDegree = Math.acos(cosStart);
                    } else {
                        startDegree = 2 * Math.PI - Math.acos(cosStart);
                    }
                    ctx.arc(circleStart[0] - radius, circleStart[1], radius, startDegree, startDegree + alpha)
                }
                drawnParts.add(number);
                if (drawStyle === "highlight") {
                    if (coloredParts.has(number)) {
                        ctx.fillStyle = "lime";
                        ctx.fill();
                        break
                    } else {
                        continue;
                    }
                }
                if (coloredParts.has(number)) {
                    if (highlightedPart === number) {
                        ctx.fillStyle = "lime";
                    } else {
                        ctx.fillStyle = "blue";
                    }
                } else {
                    ctx.fillStyle = "white";
                }
                ctx.fill();
                ctx.stroke();
            }
        }
        if (coloredParts.has(0)) {
            canvas.style.background = "blue";
        } else {
            canvas.style.background = "white";
        }
    }
    return drawnParts;
};
drawLobe = function(currentSet, radius, midpoint, context, fill) {
    context.beginPath();
    if (currentSet === 1) {
        context.rect(0,midpoint[1], midpoint[0]*2, midpoint[1]);
    } else if (currentSet === 2) {
        context.rect(midpoint[0],0, midpoint[0], midpoint[1]*2);
    } else if (currentSet === 3) {
        context.arc(midpoint[0],midpoint[1],radius,0,Math.PI*2);
    } else {
        let n = Math.pow(2, currentSet - 3);
        let dist = radius / (Math.cos(Math.PI / (n * 2)));
        let lobeRadius = ((radius * Math.tan(Math.PI / (n * 2))));
        for (let j = 0; j < 2 * n; j++) {
            let heading = [0, 0, 0];
            heading[0] = Math.PI / n * (j > 0 ? (j - 1) : (2 * n - 1));
            heading[1] = Math.PI / n * j;
            heading[2] = Math.PI / n * ((j + 1) % (2 * n));
            let x = [0, 0, 0];
            let y = [0, 0, 0];
            let counter = 0;
            for (let m = (j > 0 ? (j - 1) : (2 * n - 1)); m !== (j + 2) % (2 * n); m = (m + 1) % (2 * n)) {
                if (m / n !== 0.5 && m / n !== 1.5) {
                    x[counter] = dist / Math.sqrt(1 + Math.pow(Math.tan(heading[counter]), 2));
                    x[counter] = (Math.abs(heading[counter] - Math.PI) < Math.PI / 2 ? -1 : 1) * x[counter];
                    y[counter] = x[counter] * Math.tan(heading[counter]);
                } else {
                    x[counter] = 0;
                    y[counter] = heading[counter] < Math.PI ? dist : (-1 * dist);
                }
                counter += 1;
            }
            let point1 = pointsOfIntersection([x[0] + midpoint[0], y[0] + midpoint[1]], [x[1] + midpoint[0], y[1] + midpoint[1]], lobeRadius);
            let point2 = pointsOfIntersection([x[1] + midpoint[0], y[1] + midpoint[1]], [x[2] + midpoint[0], y[2] + midpoint[1]], lobeRadius);
            let cosAlpha = 1 - Math.pow(distance(point1, point2), 2) / (2 * Math.pow(lobeRadius, 2));
            let alpha = Math.acos(cosAlpha);
            let cosStart = 1 - Math.pow(distance([x[1] + midpoint[0] + lobeRadius, y[1] + midpoint[1]], point1), 2) / (2 * Math.pow(lobeRadius, 2));
            let start = Math.acos(cosStart);
            if (point1[1] < y[1] + midpoint[1]) {
                start = 2 * Math.PI - start;
            }
            if (j % 2 === 0) {
                context.arc(midpoint[0] + x[1], midpoint[1] + y[1], lobeRadius, start, start - alpha);
            } else {
                context.arc(midpoint[0] + x[1], midpoint[1] + y[1], lobeRadius, start, start - alpha, true);
            }
        }
    }
    if (fill) {
        context.fill();
    }
    context.stroke();
};
drawSineOrCosine = function(canvas, coloredParts, setAmount, choice, sine, drawnParts, highlightedPart, drawStyle = "normal") {
    if (drawStyle === "normal") {
        if (coloredParts.has(0)) {
            canvas.style.background = "blue";
        } else {
            canvas.style.background = "white";
        }
    }
    let ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    if (drawStyle === "highlight") {
        ctx.globalCompositeOperation = "lighten";
        ctx.fillStyle = "lime";
    } else if (drawStyle === "normal"){
        ctx.clearRect(0, 0, width, height);
    } else if (drawStyle === "line") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "black";
    }
    for (let i = drawStyle==="highlight"? [...coloredParts][0]:1; i < (drawStyle==="highlight"? [...coloredParts][0]+1:Math.pow(2, setAmount)); i++) {
        if (drawStyle === "line" && Math.log2(i) % 1 === 0) {
            continue;
        }
        let binary = i.toString(2);
        let coloredSets = [];
        for (let j = 0; j < binary.length; j++) {
            if (binary[j] === "1") {
                coloredSets.push(binary.length - 1 - j);
            }
        }
        ctx.beginPath();
        if (sine) {
            ctx.moveTo(0, height / 2);
        } else {
            ctx.moveTo(0, height / 2 - (((height - 10) / 2) / Math.pow(2, i)) * Math.cos(0));
        }
        for (let x = 0; x < width; x++) {
            let miny = 0;
            for (let setNumber of coloredSets) {
                let y = 0;
                if (sine) {
                    y = (height) / 2 - (((height - 10) / 2) / Math.pow(2, setNumber)) * Math.sin((x + 1) / ((width) / ((Math.pow(2, setNumber) * 2 * Math.PI))));
                } else {
                    y = (height) / 2 - (((height - 10) / 2) / Math.pow(2, setNumber)) * Math.cos((x + 1) / ((width) / ((Math.pow(2, setNumber) * Math.PI))));
                }
                if (y > miny) {
                    miny = y;
                }
            }
            ctx.lineTo(x + 1, miny);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        if (drawStyle === "normal") {
            if (coloredParts.has(i)) {
                ctx.fillStyle = "blue";
                if (i === highlightedPart) {
                    ctx.fillStyle = "lime";
                } else if (!drawnParts.has(i) && choice === 2) {
                    ctx.fillStyle = "orangered";
                }
            } else {
                ctx.fillStyle = "white";
            }
        }
        if (drawStyle !== "line") {
            ctx.fill();
        }
        ctx.stroke();
    }
};
drawEdwardsVennDiagram = function(canvas, coloredParts, setAmount, drawStyle) {
    let midpoint = [canvas.width / 2,canvas.height / 2];
    let radius = Math.min(midpoint[0], midpoint[1]) * 2 / 3;
    let ctx = canvas.getContext("2d");
    if (drawStyle === "line") {
        ctx.globalCompositeOperation = "source-over";
        for (let set = 1; set <= setAmount; set++) {
            drawLobe(set,radius,[canvas.width/2,canvas.height/2],ctx, false);
        }
        return;
    }
    let maskCanvas = document.createElement('canvas'); //https://stackoverflow.com/questions/6271419/how-to-fill-the-opposite-shape-on-canvas/
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    let maskCtx = maskCanvas.getContext('2d');
    let maskCanvas2 = document.createElement('canvas');
    let maskCtx2 = maskCanvas2.getContext("2d");
    maskCanvas2.width = canvas.width;
    maskCanvas2.height = canvas.height;
    let fillParts = new Set(coloredParts);
    maskCtx.fillStyle = "white";
    maskCtx.strokeStyle = "white";
    maskCtx.globalCompositeOperation = 'xor';
    maskCtx2.globalCompositeOperation = "source-over";
    if (drawStyle === "normal") {
        if (fillParts.size > Math.pow(2, setAmount) / 2) {
            fillParts = difference(Array.from(Array(Math.pow(2, setAmount)).keys()), fillParts);
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            maskCtx.fillStyle = "blue";
            maskCtx.strokeStyle = "blue";
            maskCtx2.fillStyle = "white";
            ctx.globalCompositeOperation = "lighten";
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "darken";
            maskCtx2.fillStyle = "blue";
        }
    } else {
        maskCtx2.fillStyle = drawStyle === "compare"? "orangered":"lime";
        ctx.globalCompositeOperation = drawStyle==="highlight-full"? "lighten":"source-over";
    }
    for (let part of fillParts) {
        if (drawStyle !== "normal") {
            maskCtx2.globalCompositeOperation = "source-over";
            if (part === 0) {
                continue;
            }
        }
        maskCtx2.clearRect(0, 0, maskCanvas2.width, maskCanvas2.height);
        let binary = part.toString(2);
        if (drawStyle === "highlight-full") {
            binary = binary.split("").reverse().join("");
        } else {
            let maxBinary = (Math.pow(2, setAmount) - 1).toString(2);
            if (maxBinary.length > binary.length) {
                binary = "0".repeat(maxBinary.length - binary.length) + binary;
            }
        }
        let one = binary.indexOf("1");
        if (part === 0) {
            maskCtx2.fillRect(0, 0, maskCanvas2.width, maskCanvas2.height);
        } else {
            drawLobe(drawStyle === "highlight-full"? (one+1):(binary.length-one), radius, [maskCanvas2.width / 2, maskCanvas2.height / 2], maskCtx2, true);
        }
        if (drawStyle !== "normal") {
            maskCtx2.globalCompositeOperation = "destination-out";
        }
        for (let k = 0; k <= binary.length; k++) {
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            if (binary[k] === "1") {
                maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
                if (drawStyle === "highlight-full") {
                    drawLobe( k+1, radius, [maskCanvas.width / 2, maskCanvas.height / 2], maskCtx, true);
                }
            }
            if (drawStyle !== "highlight-full") {
                drawLobe(binary.length - k, radius, [maskCanvas.width / 2, maskCanvas.height / 2], maskCtx, true);
            }
            maskCtx2.drawImage(maskCanvas, 0, 0)
        }
        ctx.drawImage(maskCanvas2, 0, 0);
    }
};
drawDiagrams = function(canvases, choice, coloredParts, setNames, highlightedPart) {
    let drawnParts = new Set();
    for (let canvas = 0; canvas < canvases.length; canvas++) {
        canvases[canvas].getContext("2d").clearRect(0, 0, canvases[canvas].width, canvases[canvas].height);
        canvases[canvas].style.display = "none";
        if (choice !== 1 && canvas===0) {
            canvases[canvas].style.display = "flex";
            drawnParts = drawCircles(canvases[canvas],setNames, coloredParts,highlightedPart);
        } else if (choice > 0) {
            if (canvas > 0) {
                canvases[canvas].style.display = "flex";
                if (canvas === 3) {
                    drawEdwardsVennDiagram(canvases[canvas],coloredParts, setNames.length, "normal");
                    drawEdwardsVennDiagram(canvases[canvas],new Set([highlightedPart]), setNames.length, "highlight-single");
                    if (choice === 2) {
                        drawEdwardsVennDiagram(canvases[canvas], difference(coloredParts, drawnParts), setNames.length, "compare")
                    }
                    continue;
                }
                drawSineOrCosine(canvases[canvas], coloredParts, setNames.length, choice,canvas===1, drawnParts, highlightedPart);
            }
        }
    }
};
highlightParts = function(canvases, choice, setNames, fullHighlightPart) {
    for(let canvas = 0; canvas < canvases.length; canvas++) {
        if (canvas === 0) {
            if (choice !== 1) {
                drawCircles(canvases[canvas], setNames, new Set([fullHighlightPart]),new Set(), "highlight");
            }
        } else if (choice > 0) {
            if (canvas === 3) {
                drawEdwardsVennDiagram(canvases[canvas], new Set([fullHighlightPart]), setNames.length, "highlight-full");
                continue;
            }
            drawSineOrCosine(canvases[canvas],new Set([fullHighlightPart]), setNames.length, choice, canvas===1, new Set(), 0, "highlight")
        }
    }
};
drawDiagramLines = function(canvases, choice, setNames) {
    for(let canvas = 0; canvas < canvases.length; canvas++) {
        if (canvas === 0) {
            if (choice !== 1) {
                drawCircles(canvases[canvas], setNames, new Set(),new Set(), "line");
            }
        } else if (choice > 0) {
            if (canvas === 3) {
                drawEdwardsVennDiagram(canvases[canvas], [], setNames.length, "line");
                continue;
            }
            drawSineOrCosine(canvases[canvas],new Set(), setNames.length, choice, canvas===1, new Set(), 0, "line")
        }
    }
};
draw = function() {
    let canvases = [];
    for (let i = 1; i < 5; i++) {
        canvases.push(document.getElementById("canvas"+i))
    }
    let choice = parseInt(document.querySelector('input[name="choice"]:checked').value);
    let equationResult = translateInput();
    if (equationResult === false) {
        return;
    }
    let setNames = equationResult[1];
    let coloredParts = equationResult[0][0];
    let highlightSets = document.getElementById("color").value.toUpperCase();
    let highlightedPart = 0;
    for (let letter of Array.from(highlightSets)) {
        if (!setNames.includes(letter)) {
            alert("Palun ärge sisestage esiletõstmisvälja hulganimesid, mis ei esine tehtes.");
            highlightedPart = 0;
            break;
        }
        highlightedPart += Math.pow(2,setNames.indexOf(letter));
    }
    let fullHighlightedPart = highlightedPart;
    highlightedPart = coloredParts.has(highlightedPart)*highlightedPart;
    drawDiagrams(canvases,choice,coloredParts,setNames,highlightedPart);
    if (fullHighlightedPart > 0) {
        highlightParts(canvases, choice, setNames, fullHighlightedPart);
    }
    drawDiagramLines(canvases, choice, setNames);
};